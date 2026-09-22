# Karigar

Companion platform for the Ludo Mandala craft toolkit. Two products, one codebase:

- **Facilitator console** (`/org`) — social-innovation labs and NGO field teams turn a mandala board session into a structured artisan profile, analyse it, and hand over an app.
- **Artisan app** (`/k/:token`) — the artisan's own PWA. Their board summary in their language, and AI practice conversations with the audiences they need to face: buyers, young online customers, organisations, stall visitors.

## Why it exists

Thousands of craft clusters are losing practitioners. Organisations run capacity-building and market-linkage work with them, but with no structure — DIY, ad hoc, and the information a brand ends up marketing from is thin and second-hand. The craft lives in the artisan's gestures and judgment, which is exactly what a surface-level intake loses.

The mandala board captures that. This platform is what happens *after* the board: the session becomes a profile, the profile becomes a tool the artisan owns, and the artisan practises speaking for themselves instead of being spoken for.

## Stack

Static front end + Vercel serverless functions. No framework is imposed — see `HANDOFF.md` for the recommended build.

```
deploy/
├── api/
│   ├── chat.js          Edge proxy to Anthropic (holds the API key)
│   └── profile.js       Reads one profile by handover token (datastore stub)
├── public/
│   ├── manifest.webmanifest
│   ├── sw.js            App-shell service worker
│   └── icons/           192 / 512 / maskable / apple-touch
├── design/              Current working prototype + shared data modules
├── vercel.json          Rewrites for /k/:token and /org, PWA headers
└── .env.example
```

## Deploy

```bash
npm i -g vercel
vercel link
vercel env add ANTHROPIC_API_KEY      # server-side only, never shipped to the client
vercel --prod
```

Then set `NEXT_PUBLIC_APP_ORIGIN` to the deployed origin so handover links and QR codes point at the real host.

## The two data modules are production-ready

`design/karigar-data.js` — the full mandala card schema (6 theme rings, 4 reflection cards, 3 story modules, ~50 fields), ring geometry and colours read off the physical board, and four composite artisan records in Gujarati, Hindi, Marathi and English.

`design/karigar-i18n.js` — complete UI dictionaries for English, Hindi, Gujarati and Marathi, plus translated card decks, ring names and persona definitions. Bengali, Tamil and Kannada are wired as conversation languages.

Both are plain ES modules with no dependencies. Move them into the real app as-is.
