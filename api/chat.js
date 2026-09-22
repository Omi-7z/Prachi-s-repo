// Karigar model proxy — free by default.
//
// ZERO-SPEND GUARANTEE
// This file cannot spend money unless you deliberately set PROVIDER=anthropic AND supply
// an ANTHROPIC_API_KEY. With no configuration at all it runs in 'demo' mode and costs
// nothing. The recommended setup (PROVIDER=gemini) uses Google AI Studio's free tier,
// which is rate-limited rather than billed — there is no card on file to charge.
//
// Providers, all one interface:
//   demo       no key, no network. Scripted replies. For layout and flow work only.
//   gemini     Google AI Studio free tier. RECOMMENDED — best Indic-language quality of
//              the free options, which matters here more than anything else.
//              Free-tier prompts may be used by Google to improve its products and read by
//              human reviewers — see DEPLOY.md before real artisans' sessions go through it.
//   groq       Groq free tier. Very fast, weaker on Hindi/Gujarati/Marathi.
//   openrouter OpenRouter's `:free` models. Handy fallback, availability varies.
//   anthropic  Paid. Only reachable if you set PROVIDER=anthropic yourself.
//
// Swapping providers is an env var. The request and response shape never changes, so the
// front end does not care which one is live.
//
// Callers must be a signed-in facilitator or hold a live handover token. A free tier is
// metered per day, so an open proxy would let anyone burn the organisation's quota.
import { currentFacilitator, resolveToken } from '../lib/auth.js';
import { json, route } from '../lib/http.js';

const PROVIDER = (process.env.PROVIDER || 'demo').toLowerCase();

// Hard ceilings, applied before any provider is called. The extractor asks for up to 6000
// output tokens on a long session, and newer Gemini models spend part of the output budget
// on thinking, so a lower ceiling truncates the JSON and the extraction fails.
const MAX_OUTPUT_TOKENS = 8000;
const MAX_INPUT_CHARS = 60000;

async function allowed(req) {
  const token = req.headers.get('x-karigar-token');
  if (token) return (await resolveToken(token)).status === 200;
  return !!(await currentFacilitator(req));
}

// Self-check for facilitators: open /api/chat?test=1 (one call) or ?test=2 (a practice-shaped
// two-turn exchange) while signed in. It makes one tiny call
// to the configured provider and reports what came back, so a broken key or retired model
// shows up as a readable message instead of a silent practice screen.
export const GET = route(async req => {
  if (!(await currentFacilitator(req))) return json({ error: 'sign in at /org first, then reopen this page' }, 401);
  const status = {
    provider: PROVIDER,
    paused: process.env.KARIGAR_PAUSED === '1',
    keySet: {
      gemini: !!process.env.GEMINI_API_KEY, groq: !!process.env.GROQ_API_KEY,
      openrouter: !!process.env.OPENROUTER_API_KEY, anthropic: !!process.env.ANTHROPIC_API_KEY
    }
  };
  if (!['1', '2'].includes(new URL(req.url).searchParams.get('test'))) return json(status);
  const started = Date.now();
  try {
    // test=2 mirrors a real practice turn: the character spoke first, the artisan replied.
    const two = new URL(req.url).searchParams.get('test') === '2';
    const messages = two
      ? normaliseTurns([{ role: 'assistant', content: 'Namaste! What do you make?' }, { role: 'user', content: 'I make bandhani.' }])
      : [{ role: 'user', content: 'Reply with the single word: namaste' }];
    let text;
    switch (PROVIDER) {
      case 'gemini': text = await gemini(two ? 'You are a textile buyer. Reply in one short sentence.' : '', messages, two ? 400 : 50); break;
      case 'anthropic': text = await anthropic('', messages, 50); break;
      case 'groq': case 'openrouter':
        return json({ ...status, test: 'skipped — send a practice message instead' });
      default: text = demo('', messages);
    }
    return json({ ...status, test: 'ok', reply: text, ms: Date.now() - started });
  } catch (err) {
    return json({ ...status, test: 'failed', reason: (err && err.reason) || 'upstream', detail: String(err && err.message || err) }, 502);
  }
});

export const POST = route(async req => {
  if (process.env.KARIGAR_PAUSED === '1') return json({ error: 'paused' }, 503);
  if (!(await allowed(req))) return json({ error: 'unauthorised' }, 401);

  let body;
  try { body = await req.json(); } catch { return json({ error: 'Bad JSON' }, 400); }

  const { system = '' } = body || {};
  if (!Array.isArray(body?.messages) || !body.messages.length) return json({ error: 'messages required' }, 400);
  const messages = normaliseTurns(body.messages);

  const maxTokens = Math.min(Number(body.max_tokens) || 1200, MAX_OUTPUT_TOKENS);
  const inputChars = String(system).length + messages.reduce((n, m) => n + String(m.content || '').length, 0);
  if (inputChars > MAX_INPUT_CHARS) return json({ error: 'too_large' }, 413);

  try {
    let text;
    switch (PROVIDER) {
      case 'gemini':     text = await gemini(system, messages, maxTokens); break;
      case 'groq':       text = await openaiShaped(system, messages, maxTokens, {
                           url: 'https://api.groq.com/openai/v1/chat/completions',
                           key: process.env.GROQ_API_KEY,
                           model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'
                         }); break;
      case 'openrouter': text = await openaiShaped(system, messages, maxTokens, {
                           url: 'https://openrouter.ai/api/v1/chat/completions',
                           key: process.env.OPENROUTER_API_KEY,
                           model: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct:free'
                         }); break;
      case 'anthropic':  text = await anthropic(system, messages, maxTokens, body.model); break;
      default:           text = demo(system, messages);
    }
    return json({ text, provider: PROVIDER });
  } catch (err) {
    // A free tier that is rate-limited should degrade, not break the field tool.
    console.error('chat upstream', PROVIDER, err);
    const reason = (err && err.reason) || 'upstream';
    return json({ error: 'upstream', reason, provider: PROVIDER, detail: String(err && err.message || err) }, reason === 'quota' ? 429 : 502);
  }
});

// Why a call failed, in terms the app can act on: 'quota' (free-tier limit reached), 'key'
// (missing or rejected key), 'config', 'empty' (model answered nothing), 'upstream' (other).
function reasonFor(status) {
  if (status === 429) return 'quota';
  if (status === 401 || status === 403) return 'key';
  return 'upstream';
}
function withReason(err, reason) { err.reason = reason; return err; }

// Practice conversations open with the character's line, so the history the app sends starts
// with an assistant turn. Gemini and Anthropic both reject a conversation that does not start
// with the user, and neither accepts two turns in a row from the same side.
const OPENING = '[The artisan has just opened the conversation.]';
function normaliseTurns(raw) {
  const out = [];
  for (const m of raw) {
    const role = m && m.role === 'assistant' ? 'assistant' : 'user';
    const content = String((m && m.content) || '');
    const last = out[out.length - 1];
    if (last && last.role === role) last.content += '\n\n' + content;
    else out.push({ role, content });
  }
  if (out.length && out[0].role !== 'user') out.unshift({ role: 'user', content: OPENING });
  return out;
}

// ── Google AI Studio (free tier) ────────────────────────────────────────────────
// Free tier is metered by requests per minute and per day, not by money.
// Get a key at aistudio.google.com/apikey — no billing account required.
// Default is Google's "latest Flash" alias: fixed versions are retired on a schedule
// (gemini-2.0-flash shut down June 2026, gemini-2.5-flash is due October 2026), and a
// retired model makes every call fail. GEMINI_MODEL sets the first model tried.
const GEMINI_FALLBACKS = ['gemini-flash-lite-latest', 'gemini-3.5-flash', 'gemini-3.5-flash-lite'];
const GEMINI_THINKING_HEADROOM = 4096;

async function gemini(system, messages, maxTokens) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw withReason(new Error('GEMINI_API_KEY not set'), 'config');
  // Each Gemini model has its own free-tier quota, and some allow only a few dozen requests a
  // day. When one is used up (429), unknown (404), overloaded (5xx) or returns nothing, the
  // next one is tried, so a practice session keeps going instead of stopping mid-conversation.
  const chain = [...new Set([process.env.GEMINI_MODEL || 'gemini-flash-latest', ...GEMINI_FALLBACKS])];
  let last;
  for (const model of chain) {
    try {
      return await geminiCall(model, key, system, messages, maxTokens);
    } catch (err) {
      last = err;
      if (!(err.status === 429 || err.status === 404 || err.status >= 500 || err.reason === 'empty')) throw err;
    }
  }
  // Optional last resort on a different provider's free tier.
  if (process.env.GROQ_API_KEY) {
    return openaiShaped(system, messages, maxTokens, {
      url: 'https://api.groq.com/openai/v1/chat/completions',
      key: process.env.GROQ_API_KEY,
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'
    });
  }
  throw last;
}

async function geminiCall(model, key, system, messages, maxTokens) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
    {
      method: 'POST',
      // header rather than ?key= so the key never lands in request logs
      headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        systemInstruction: system ? { parts: [{ text: system }] } : undefined,
        contents: messages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: String(m.content || '') }]
        })),
        // Newer Flash models think before answering, and that thinking counts against
        // maxOutputTokens. A practice reply asks for 400 tokens; with no headroom the model
        // can spend all of it thinking and return no text at all.
        generationConfig: { maxOutputTokens: maxTokens + GEMINI_THINKING_HEADROOM, temperature: 0.8 }
      })
    }
  );
  if (!res.ok) {
    const body = (await res.text()).slice(0, 400);
    const err = new Error('gemini ' + model + ' ' + res.status + ' ' + body);
    err.status = res.status;
    // Gemini reports a wrong key as a 400, not a 401
    throw withReason(err, /API_KEY_INVALID|API key not valid/i.test(body) ? 'key' : reasonFor(res.status));
  }
  const data = await res.json();
  // skip thought-summary parts if a model ever returns them; only the answer is wanted
  const text = (data.candidates?.[0]?.content?.parts || []).filter(p => !p.thought).map(p => p.text || '').join('').trim();
  if (!text) {
    const why = data.candidates?.[0]?.finishReason || data.promptFeedback?.blockReason || 'none';
    throw withReason(new Error('gemini ' + model + ' returned no text (' + why + ')'), 'empty');
  }
  return text;
}

// ── Groq / OpenRouter — both speak the OpenAI chat shape ────────────────────────
async function openaiShaped(system, messages, maxTokens, cfg) {
  if (!cfg.key) throw new Error('API key not set for this provider');
  const res = await fetch(cfg.url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: 'Bearer ' + cfg.key },
    body: JSON.stringify({
      model: cfg.model,
      max_tokens: maxTokens,
      temperature: 0.8,
      messages: [...(system ? [{ role: 'system', content: system }] : []), ...messages]
    })
  });
  if (!res.ok) {
    const err = new Error(cfg.url + ' ' + res.status + ' ' + (await res.text()).slice(0, 300));
    err.status = res.status;
    throw withReason(err, reasonFor(res.status));
  }
  const data = await res.json();
  return (data.choices?.[0]?.message?.content || '').trim();
}

// ── Anthropic — PAID. Unreachable unless you opt in explicitly. ─────────────────
async function anthropic(system, messages, maxTokens, model) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error('ANTHROPIC_API_KEY not set — refusing to call a paid provider');
  const allowedModels = new Set(['claude-sonnet-4-5', 'claude-haiku-4-5']);
  const chosen = allowedModels.has(model) ? model : 'claude-haiku-4-5';   // cheapest by default
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({ model: chosen, max_tokens: maxTokens, system, messages })
  });
  if (!res.ok) {
    const err = new Error('anthropic ' + res.status + ' ' + (await res.text()).slice(0, 300));
    err.status = res.status;
    throw withReason(err, reasonFor(res.status));
  }
  const data = await res.json();
  return (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
}

// ── Demo mode — no key, no network, no cost ─────────────────────────────────────
// Honest about what it is. Good for checking layout, language rendering and navigation;
// useless for judging whether the agent behaves well. Do not demo this to a partner as
// though it were the real thing.
function demo(system, messages) {
  const wantsJson = /single JSON object/i.test(system);
  if (wantsJson) {
    return JSON.stringify({
      communication_profile: '[demo mode] No model is configured, so this is placeholder text. Set PROVIDER=gemini with a free AI Studio key to see real analysis.',
      strengths: [{ title: '[demo]', detail: 'Configure a provider to generate this.' }],
      gaps: [{ title: '[demo]', detail: 'Configure a provider to generate this.' }],
      recommended_segments: [{ id: 'brand', label: '[demo]', why: 'Placeholder.' }],
      vocabulary: ['[demo]'],
      care_notes: ['Demo mode — nothing here reflects the real record.'],
      artisan_summary_local: '[demo mode] Placeholder summary.',
      artisan_summary_en: '[demo mode] Placeholder summary.',
      fields: {},
      session_note: '[demo mode] No extraction ran.',
      items: [
        { kind: 'STRONG', text: '[demo mode] Placeholder feedback.' },
        { kind: 'TRY THIS', text: 'Set PROVIDER=gemini to get real coaching.' },
        { kind: 'YOU KNOW MORE', text: 'Demo mode does not read your board.' }
      ]
    });
  }
  const turn = messages.filter(m => m.role === 'user').length;
  const lines = [
    '[demo mode] No model is configured yet, so I cannot really answer. Set PROVIDER=gemini with a free key and I will talk back properly.',
    '[demo mode] Still a placeholder — your words are not being read.',
    '[demo mode] Configure a provider to practise for real.'
  ];
  return lines[Math.min(turn - 1, lines.length - 1)] || lines[0];
}
