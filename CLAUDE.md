# Karigar — notes for Claude Code

Read `HANDOFF.md` (decisions and invariants) and `ARCHITECTURE.md` (schema, routes) first.

## What is served where

| Address | Page | Source |
| --- | --- | --- |
| `/` | Karigar Ecosystem website (public) | `public/index.html` shell → `public/site.dc.html` |
| `/console` | Karigar Ecosystem console (facilitators, sign-in required) | `public/console.html` shell → `public/karigar.dc.html` |
| `/app` | The artisan app's sign-in (username and password the facilitator sets) | `api/artisan-page.js?app=1` → `public/artisan.html` → `public/karigar.dc.html` |
| `/k/:token` | The artisan's own app from their link, no sign-in | `api/artisan-page.js` → `public/artisan.html` → `public/karigar.dc.html` |

`public/runtime.js` renders both `.dc.html` designs and bridges them to the server: real auth (`/api/session`, `/api/signup`), the database-backed profiles API (`/api/profiles`), handover links issued by the server (`lib/origin.js` for the public address), and `window.claude` → `/api/chat`.

- Artisan sign-in: `api/artisan/[id].js` (login, logout, session in one function), `lib/artisan-auth.js` (signed httpOnly cookie `karigar_artisan`, scrypt passwords like facilitators', failed attempts rate-limited in `login_attempts`). Facilitators set or reset it on the board's Handover tab (`POST /api/profiles/:id` with `set-login` / `clear-login`). A new password or a revoked link ends the artisan's sessions. The artisan's own app language is saved through `POST /api/artisan/lang`, the only profile field an artisan writes.
- The console has no artisan-app preview: facilitators never see practice conversations, which are not stored on the server at all (only counts in `practice_events`).
- Old links keep working: `/console#k=<code>` goes to `/k/<code>`, and `/console#app` when signed out goes to `/app`.
- The console's "← Website" link goes to `/`.

## Assets

- Card artwork: `public/cards/` (`craft.png`, `place.png`, `lineage.png`, `material.png`, `culture.png`, `pride.png`, `r-*.png`, `box-theme.png`).
- Logo: `public/karigar-logo.svg` (also the favicon). App icons rendered from it: `public/icons/karigar-*.png`. `/icons/` is served as immutable, so a changed icon needs a new file name, not an overwrite.
- Printable kit: `public/kit/print/` (theme decks and reflection cards, front/back, English and Hindi, plus story sheets and box wraps). Committed as plain files: no single file is over ~3 MB.
- Reference images with root-relative paths (`/cards/…`, `/kit/print/…`) so they resolve on `/`, `/console` and `/k/<token>` alike.

## Fonts

Instrument Sans (headings and body) and Newsreader (italic accents) from Google Fonts, plus Noto Sans for Indic scripts. `karigar-i18n.js` still names the older font families in its language table; the console's `langOf()` maps them to Instrument Sans at runtime, so leave that file as the design exports it.

## Design syncs

Design exports arrive as whole files. Strip the injected `data-omelette` lines, take the design, and put the server wiring back wherever the design simulates it (localStorage profiles, `publish()`, `routeLink()`, `hosted()`, the website's mocked pilot forms and code entry, the console's mocked sign-in screens and sample organisation name). The design's `style-hover` attribute is handled in `runtime.js`. Ring keys are stable data: the "Lineage" ring is labelled "Legacy" on screen, but its key stays `lineage` — never migrate stored data for a label change.

## The card deck

`public/karigar-data.js` (from the design) is the only list of questions: SCHEMA has one group per printed card, a `Header` group (name, years in practice) that is not on the board, and `MIGRATE(record)`, which maps answers saved under retired keys onto the current deck. The server reads the deck through `lib/deck.js` (board total 63, progress, a merge-safe MIGRATE) and never lists field keys itself. `scripts/migrate-deck.js` rewrites stored answers and translations onto the deck, backing each profile up first in `deck_migration_backup`. It runs from `scripts/migrate.js` on production deploys and locally only, never on previews, which on some projects share the production database.

## Translations

Card answers are stored in the language they were recorded in. Translations made by the model are saved on the profile (`artisan_profiles.translations`), and are cleared when the answers change, so a language is only paid for once. The artisan's phone also keeps its own copies.

## Vercel limits

The Hobby plan allows at most 12 serverless functions per deployment, and every file in `api/` is one. A deploy over the limit fails outright. Add a route to an existing file (see `api/artisan/[id].js`) rather than a new file. Count: `find api -name '*.js' | wc -l`.

## Local testing

`npm run dev` (see `scripts/dev-server.js`) needs `DATABASE_URL` and `SESSION_SECRET`; `ANTHROPIC_API_KEY` for model calls. Create a sign-in with `npm run facilitator`.
