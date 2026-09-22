# Architecture

## Domain model

```
organisation ─┬─< facilitator (staff | champion_leader*)   * role reserved, not yet built
              └─< artisan_profile ─┬─< card_answer (field_key, value, source_quote)
                                   ├─── analysis (JSONB)
                                   ├─── handover_token (opaque, revocable)
                                   └─< practice_event (segment_id, started_at)  # counts only
```

## Schema sketch (Drizzle / Postgres)

```ts
organisations   id, name, created_at
facilitators    id, org_id, name, email, role('staff'|'champion_leader'), artisan_profile_id?
artisan_profiles id, org_id, name, craft_local, region, lang,
                 cluster, approved_at, analysis jsonb,
                 created_by, created_at, updated_at
card_answers    profile_id, field_key, value text, source_quote text, PRIMARY KEY (profile_id, field_key)
handover_tokens id, profile_id, token unique, version int, revoked_at, last_opened_at
practice_events id, profile_id, segment_id, created_at      -- no transcript, ever
```

`card_answers` is keyed by `field_key` from `karigar-data.js` — do not invent a parallel schema. `FIELD_INDEX` maps every key to its deck, ring and label.

## Routes

| Route | Who | Notes |
|---|---|---|
| `/org` | authed facilitator | overview, board, artisans, new session |
| `/k/:token` | artisan, no login | PWA scope; 410 on revoked token |
| `POST /api/chat` | both | model proxy; model allowlist enforced |
| `GET /api/profile?token=` | artisan app | strips facilitator-only fields |
| `POST /api/extract` | facilitator | transcript → card answers + source quotes |
| `POST /api/transcribe` | facilitator | proxies to self-hosted Whisper; audio deleted in-request |

## The four AI calls

All four live in the prototype and should move into `lib/agents/` verbatim, each keeping the shared `groundRules()` preamble:

1. **Extract** — transcript → `{ fields: { key: { value, quote } }, session_note }`. Transcriber-organiser, not a writer. Never fills a gap.
2. **Analyse** — session → communication profile, strengths, gaps, recommended practice rooms, the artisan's own vocabulary, care notes, and a summary written *to the artisan* in their language.
3. **Roleplay** — plays a persona in the artisan's language, in character, with realistic commercial pressure. Never breaks role.
4. **Coach** — transcript → one thing done well (quoting them), one sentence to try next time, one thing from their board they did not use.

Personas live in `karigar-i18n.js` under `SEGMENT_TEXT`, each with labels and blurbs in all four languages plus an English persona brief for the system prompt. Artisans can also describe an audience in free text, which the model infers a character from.

## PWA

`manifest.webmanifest` is standalone-display, portrait, warm-paper theme, with a maskable icon. `sw.js` precaches the shell and is network-first on navigations so a fresh profile is picked up, cache-first on assets, and never caches `/api/*`.

The install flow is a first-run screen on the artisan app with platform-specific instructions (Android ⋮ menu, iOS Share sheet) because iOS Safari fires no `beforeinstallprompt`. Where the event *is* available it is captured and offered as a single Install button.

## Accessibility and field realities

- 44px minimum touch targets throughout; 16px inputs so iOS does not zoom on focus.
- Noto Sans Devanagari / Gujarati / Bengali / Tamil / Kannada loaded per script.
- The artisan app must read usefully offline — the board summary is the offline surface; practice needs network.
- Assume mid-range Android on intermittent 4G. Keep the artisan bundle small; the console can be heavier.
- Voice input is the most valuable unbuilt feature for low-literacy users. Design for it early even if it ships later.
