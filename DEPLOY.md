# Going live

Start to finish. Everything here is free-tier.

## 0. What you need

- A GitHub account with push access to `Omi-7z/Prachi-s-repo`
- A [Vercel](https://vercel.com) account — sign in **with GitHub**, it makes step 3 one click
- An Anthropic API key from [console.anthropic.com](https://console.anthropic.com) → API keys

## 1. Get the code into the repo

Download this project, then from the folder that contains `deploy/`:

```bash
cd deploy
git init
git add .
git commit -m "Karigar: initial deploy scaffold"
git branch -M main
git remote add origin https://github.com/Omi-7z/Prachi-s-repo.git
git push -u origin main
```

The contents of `deploy/` become the repo root — that matters, because Vercel looks for `vercel.json`, `api/` and `public/` at the root.

If the repo already has commits, `git pull --rebase origin main` first.

## 2. Pick a project name

`karigar.vercel.app` is taken. The name of the Vercel **project** becomes the subdomain, so choose one that is free:

- `karigar-toolkit` → karigar-toolkit.vercel.app ← currently set as the default
- `karigar-app`, `karigar-mandala`, `mandala-karigar`, `karigar-in`

Vercel tells you immediately if a name is taken; you can rename later under Settings → General without losing the deployment.

A real domain is better long term — `karigar.in` or similar. Vercel → Settings → Domains → Add, then point the two DNS records it shows you. Handover links read cleaner and the PWA install prompt looks less like a test build.

## 3. Deploy

**Via the dashboard (easiest):** Vercel → Add New → Project → import `Prachi-s-repo` → set the project name from step 2 → Framework Preset **Other** → Deploy.

**Via CLI:**

```bash
npm i -g vercel
vercel login
vercel link          # choose the project name here
vercel --prod
```

## 4. Add the API key

Vercel → your project → Settings → Environment Variables:

| Name | Value | Environments |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | your key | Production, Preview, Development |
| `NEXT_PUBLIC_APP_ORIGIN` | `https://<your-project>.vercel.app` | all three |

Redeploy after adding them — env vars are baked in at build time.

The key lives only on the server. `api/chat.js` proxies every model call, so it never reaches an artisan's phone.

## 5. Point the prototype at the live domain

In the design, open Tweaks and set **appOrigin** to your real origin. Handover links and QR codes regenerate immediately, so a scan from your phone hits the live app instead of a placeholder.

## 6. Test the install flow on a real phone

1. Open the handover screen on your laptop and scan the QR with your phone's camera.
2. The artisan app opens with the install screen first.
3. **Android/Chrome:** tap Install, or ⋮ → Install app. **iPhone/Safari:** Share → Add to Home Screen (iOS fires no install event, which is why the screen spells out the steps).
4. Launch from the home-screen icon. It should open full-screen with no browser chrome and the mandala icon.

If it opens in a browser tab instead, the manifest or service worker was not served — check that `manifest.webmanifest` and `sw.js` sit at the deployed root and return 200.

## 7. From here it needs a database

The prototype keeps everything in the browser's own storage, which means profiles live on whichever laptop created them and a handover link cannot actually load a profile on the artisan's phone yet.

That is the first thing to build, and `HANDOFF.md` has the schema. Until then the deployed app is a working demo, not a live field tool — fine for showing partners, not yet for a real cluster.

## Keeping the repo current

Every push to `main` redeploys automatically. Branches get their own preview URL, which is the safe way to try a change before a field visit.
