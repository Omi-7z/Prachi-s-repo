# Karigar — notes for Claude Code

Read `HANDOFF.md` (decisions and invariants) and `ARCHITECTURE.md` (schema, routes) first.

## What is served where

| Address | Page | Source |
| --- | --- | --- |
| `/` | Karigar Ecosystem website (public) | `public/index.html` shell → `public/site.dc.html` |
| `/console` | Karigar Ecosystem console (facilitators, sign-in required) | `public/console.html` shell → `public/karigar.dc.html` |
| `/k/:token` | The artisan's own app, no login | `api/artisan-page.js` → `public/artisan.html` → `public/karigar.dc.html` |

`public/runtime.js` renders both `.dc.html` designs and bridges them to the server: real auth (`/api/session`, `/api/signup`), the database-backed profiles API (`/api/profiles`), handover links issued by the server (`lib/origin.js` for the public address), and `window.claude` → `/api/chat`.

- Website links into the console keep their hash: `/console#k=<code>` (artisan code entry; `runtime.js` sends it on to `/k/<code>`) and `/console#app` (the facilitator's preview of the artisan app).
- The console's "← Website" link goes to `/`.

## Assets

- Card artwork: `public/cards/` (`craft.png`, `place.png`, `lineage.png`, `material.png`, `culture.png`, `pride.png`, `r-*.png`, `box-theme.png`).
- Printable kit: `public/kit/print/` (theme decks and reflection cards, front/back, English and Hindi, plus story sheets and box wraps). Committed as plain files: no single file is over ~3 MB.
- Reference images with root-relative paths (`/cards/…`, `/kit/print/…`) so they resolve on `/`, `/console` and `/k/<token>` alike.

## Fonts

Newsreader (headings) and Figtree (body) from Google Fonts, plus Noto Sans for Indic scripts. `karigar-i18n.js` still names the older font families in its language table; the console's `langOf()` maps them to Figtree/Newsreader at runtime, so leave that file as the design exports it.

## Design syncs

Design exports arrive as whole files. Strip the injected `data-omelette` lines, take the design, and put the server wiring back wherever the design simulates it (localStorage profiles, `publish()`, `routeLink()`, `hosted()`, the website's mocked sign-in, account request and code entry). Ring keys are stable data: the "Lineage" ring is labelled "Legacy" on screen, but its key stays `lineage` — never migrate stored data for a label change.

## Local testing

`npm run dev` (see `scripts/dev-server.js`) needs `DATABASE_URL` and `SESSION_SECRET`; `ANTHROPIC_API_KEY` for model calls. Create a sign-in with `npm run facilitator`.
