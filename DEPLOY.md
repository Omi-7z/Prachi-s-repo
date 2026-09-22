# Going live

Start to finish. Everything here is free-tier.

## 0. What you need

- A GitHub account with push access to `Omi-7z/Prachi-s-repo`
- A [Vercel](https://vercel.com) account — sign in **with GitHub**, it makes step 2 one click
- An Anthropic API key from [console.anthropic.com](https://console.anthropic.com) → API keys

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
| `ANTHROPIC_API_KEY` | your key | Production, Preview, Development |
| `SESSION_SECRET` | 32+ random characters — `openssl rand -base64 48` | all three |

Then **Deployments → ⋯ → Redeploy** so the build picks them up and creates the tables.

The API key lives only on the server. `api/chat.js` proxies every model call, and it only answers a signed-in facilitator or a phone holding a live handover link.

## 5. Create the first facilitator account

Organisation accounts are made from the command line, so there is no open sign-up page. Copy the database URL from Vercel → Storage → your database → `.env.local` tab, then on your machine:

```bash
git clone https://github.com/Omi-7z/Prachi-s-repo.git && cd Prachi-s-repo
npm install
DATABASE_URL='postgres://…' npm run facilitator -- --org "Your organisation" --name "Your name" --email you@example.org
```

It asks for a password (12+ characters). Run it again with another email to add colleagues to the same organisation; run it with an existing email to reset that password.

Open `https://<your-project>.vercel.app/org` and sign in.

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
