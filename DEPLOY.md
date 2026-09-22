# Going live

Start to finish. Everything here is free-tier.

## 0. What you need

- A GitHub account with push access to `Omi-7z/Prachi-s-repo`
- A [Vercel](https://vercel.com) account — sign in **with GitHub**, it makes step 2 one click
- A free Gemini API key from [aistudio.google.com/apikey](https://aistudio.google.com/apikey) — no billing account, no card

## 1. Pick a project name

`karigar.vercel.app` is taken. The name of the Vercel **project** becomes the subdomain, so choose one that is free:

- `karigar-toolkit` → karigar-toolkit.vercel.app
- `karigar-app`, `karigar-mandala`, `mandala-karigar`, `karigar-in`

Vercel tells you immediately if a name is taken; you can rename later under Settings → General without losing the deployment.

A real domain is better long term — `karigar.in` or similar. Vercel → Settings → Domains → Add, then point the two DNS records it shows you. Handover links read cleaner and the PWA install prompt looks less like a test build.

## 2. Import the repo

Vercel → Add New → Project → import `Prachi-s-repo` → set the project name from step 1. Leave the framework preset as **Other**; `vercel.json` already sets the build command and the `public` output folder.

Do not worry if this first deploy has no database yet — the build skips migrations until one is attached.

## 3. Attach the database

Vercel → your project → **Storage** → Create → **Postgres** (Neon) → connect it to the project for Production, Preview and Development.

That sets `DATABASE_URL` / `POSTGRES_URL` for you. The tables are created by the next build: every deploy runs `npm run build`, which applies anything new in `db/migrations/`.

## 4. Add the other environment variables

Vercel → Settings → Environment Variables:

| Name | Value | Environments |
| --- | --- | --- |
| `SESSION_SECRET` | 32+ random characters — `openssl rand -base64 48` | Production, Preview, Development |
| `PROVIDER` | `gemini` | all three |
| `GEMINI_API_KEY` | your AI Studio key | all three |

Then **Deployments → ⋯ → Redeploy** so the build picks them up and creates the tables.

`api/chat.js` proxies every model call; keys stay on the server, and it only answers a signed-in facilitator or a phone holding a live handover link. With no `PROVIDER` set it runs in demo mode — no network, no cost, every reply prefixed `[demo mode]`. The paid Anthropic path is only reachable if you set `PROVIDER=anthropic` and an `ANTHROPIC_API_KEY` yourself. `KARIGAR_PAUSED=1` switches every model call off.

The Gemini free tier is limited by requests per minute and per day. When the limit is hit, calls fail until it resets; nothing is billed.

### Before real artisans' sessions go through the free tier

Google's terms for the unpaid Gemini API allow it to use what is sent — prompts and responses — to improve its products, and human reviewers may read it (detached from your account first). Here, what is sent is a transcript of an artisan's board session, their name, their answers about what may leave their community, and their practice conversations.

That is fine for a pilot with made-up or sample sessions. Before real clusters, either get each artisan's consent for it or move to a tier that does not train on data: Gemini's paid tier (same `PROVIDER=gemini`, billing enabled on the key's project, with a budget cap) or `PROVIDER=anthropic`. No code changes either way.

## 5. Create the first facilitator account

Open `https://<your-project>.vercel.app` — the home page goes to the facilitator sign-in — and click **Create an account**. Each sign-up gets its own organisation; artisans never need an account, they use the link you hand over.

Sign-up is open to anyone by default, which suits a pilot. To control it, add one of these in Vercel → Environment Variables and redeploy:

| Name | Effect |
| --- | --- |
| `SIGNUP_CODE` | sign-up asks for this code; share it only with your testers |
| `SIGNUP_DISABLED` = `1` | no sign-up at all; accounts only from the command line below |

Command line, for adding colleagues to an existing organisation or resetting a password (database URL from Vercel → Storage → your database → `.env.local`):

```bash
git clone https://github.com/Omi-7z/Prachi-s-repo.git && cd Prachi-s-repo
npm install
DATABASE_URL='postgres://…' npm run facilitator -- --org "Your organisation" --name "Their name" --email them@example.org
```

## 6. Move any prototype profiles across

If someone built profiles in the prototype, open `/org` **in that same browser** and sign in. When the organisation's account is still empty, the console offers to move those profiles into it. The built-in sample artisans are demo data and are not moved.

## 7. Test the install flow on a real phone

1. Open a profile → Handover on your laptop and scan the QR with your phone's camera.
2. The artisan app opens with the install screen first.
3. **Android/Chrome:** tap Install, or ⋮ → Install app. **iPhone/Safari:** Share → Add to Home Screen (iOS fires no install event, which is why the screen spells out the steps).
4. Launch from the home-screen icon. It should open full-screen with no browser chrome and the mandala icon, straight onto that artisan's profile.

If it opens in a browser tab instead, check that `/manifest.webmanifest`, `/api/manifest?t=…` and `/sw.js` return 200.

Back in the console, the overview now counts that app as opened.

## What is live and what is not yet

Live: profiles, card answers with their source lines, analysis, approval, the handover checklist, opaque revocable handover links, last-opened telemetry, practice counts, the cluster table, and organisation sign-in.

Not yet: **transcription** (upload a transcript; audio still needs the self-hosted Whisper service from `HANDOFF.md`), and the **champion-leader** role (reserved in the schema, deliberately not built).

## Keeping the repo current

Every push to `main` redeploys automatically. Branches get their own preview URL, which is the safe way to try a change before a field visit. Previews share the production database unless you enable Neon's per-branch databases in the Storage settings — do that before testing schema changes on a preview.
