# Handoff to Claude Code

Read this first, then `ARCHITECTURE.md`, then open `design/Karigar Platform v2.dc.html` in a browser to see the working prototype.

## What is already decided

**Do not redesign.** The visual system, the information architecture, the AI prompts and the four-language copy are all settled and user-reviewed. Your job is to make them real: a proper datastore, real auth, real handover links, real transcription.

**Do not weaken the AI ground rules.** Every prompt in the prototype carries a block of non-negotiable rules — artisan-authored voice, no romanticising of poverty or tradition, no heritage-symbol flattening, invent nothing, every claim traceable to a card answer. These are the product. Copy them verbatim from the prototype's `groundRules()` and keep them in one shared module.

## Build order

1. **Scaffold** — Next.js App Router (or Vite + Hono if you prefer static). Port `karigar-data.js` and `karigar-i18n.js` unchanged.
2. **Datastore** — Vercel Postgres via Drizzle. Schema in `ARCHITECTURE.md`. Everything currently in `localStorage` moves here.
3. **Console auth** — organisation accounts only for now. A lighter "champion leader" role (an artisan who has learned to facilitate and runs sessions for others) is in the product model and deliberately **deferred** — keep `facilitators.role` in the schema so it can land later without a migration, but do not build a separate intake yet.
4. **Artisan app** — token route `/k/:token`, no login. The token IS the credential; it is revocable and re-issuable per profile.
5. **Transcription** — the one genuinely missing piece. See below.
6. **PWA** — manifest and service worker are written; wire the install prompt and verify on real Android and iOS.

## Transcription: self-hosted Whisper, recordings deleted after extraction

**Decided.** Run Whisper (large-v3) on your own infrastructure. The audio file is accepted, transcribed, passed to the extractor, and **deleted in the same request** — it is never persisted and never sent to a third party. Only the transcript survives, and only if the facilitator saves it.

This is a consent decision before a technical one. The board explicitly asks artisans what may leave their community; a vendor silently retaining voice recordings would contradict the toolkit's own premise. Managed ASR providers were considered and rejected for that reason.

Implementation notes:
- `POST /api/transcribe` — multipart upload → Whisper → `{ text, language, segments }`, then `unlink` the temp file in a `finally` block so it goes even on error.
- Sessions are recorded in Kutchi, Halbi, Tangkhul, Maithili — languages Whisper handles unevenly, often code-switched with Hindi or Gujarati mid-sentence. Do not auto-translate; pass `task: 'transcribe'`, never `'translate'`. The extractor is instructed to keep the artisan's words as spoken.
- Pass the facilitator's declared session language as a hint, but let Whisper override it — code-switching is the norm, not the exception.
- Whisper is too heavy for Vercel's function limits. Run it as a separate container (Fly, Railway, or a GPU box) and have `/api/transcribe` proxy to it with a short-lived signed request.
- Show the facilitator the raw transcript before extraction runs. They were in the room; they are the only one who can catch a mis-heard craft term.

## What must not regress

- **Card provenance.** Every auto-filled field keeps the transcript line it came from, shown inline so a facilitator can verify it. Gaps stay empty — the extractor never fills one.
- **Session completeness.** A session counts as complete only when it reached all three decks. Theme cards alone give you a craft, not a person. The dashboard is built on this.
- **Artisan approval.** A profile is not publishable until the artisan has heard it read back and agreed. This is a hard gate, not a checkbox.
- **Practice privacy.** Conversation transcripts never leave the artisan's device. The console sees counts only. Do not add transcript visibility for facilitators, however useful it sounds.
- **Per-artisan language.** The console language and the artisan's app language are independent. Changing one must never write the other.
- **Grapheme-safe text handling.** Indic names carry matras on the first letter; use `Intl.Segmenter` for initials and truncation, never `[0]` or `slice`.

## Known prototype shortcuts

| Shortcut | Real implementation | Status |
|---|---|---|
| `localStorage` for everything | Postgres, per-organisation scoping | **Done** — only device preferences (console language, on-phone practice history) stay local |
| `window.claude.complete` | `POST /api/chat` (key server-side) | **Done** — `runtime.js` provides `window.claude.complete` backed by the proxy |
| Handover tokens derived from profile id | Opaque random tokens, revocable, `linkVersion` bump issues a new one | **Done** — a new link revokes every older one |
| Cluster figures on the dashboard | Aggregate queries | **Done** — computed from the organisation's own profiles; the Risk column is empty until someone defines it |
| Audio upload acknowledged only | Self-hosted Whisper; recordings deleted after extraction | Not yet — `api/transcribe.js` is ready for a `WHISPER_URL` |
| No auth | Organisation accounts (champion-leader role deferred) | **Done** — email + password, accounts created with `npm run facilitator` |
| `openedDaysAgo` seeded per profile | Real last-opened telemetry from the artisan app | **Done** — set when the artisan app loads its profile |
