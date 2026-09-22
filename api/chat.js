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

// Self-check for facilitators: open /api/chat?test=1 while signed in. It makes one tiny call
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
  if (new URL(req.url).searchParams.get('test') !== '1') return json(status);
  const started = Date.now();
  try {
    const messages = [{ role: 'user', content: 'Reply with the single word: namaste' }];
    let text;
    switch (PROVIDER) {
      case 'gemini': text = await gemini('', messages, 50); break;
      case 'anthropic': text = await anthropic('', messages, 50); break;
      case 'groq': case 'openrouter':
        return json({ ...status, test: 'skipped — send a practice message instead' });
      default: text = demo('', messages);
    }
    return json({ ...status, test: 'ok', reply: text, ms: Date.now() - started });
  } catch (err) {
    return json({ ...status, test: 'failed', detail: String(err && err.message || err) }, 502);
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
    return json({ error: 'upstream', provider: PROVIDER, detail: String(err && err.message || err) }, 502);
  }
});

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
// retired model makes every call fail. Pin GEMINI_MODEL only if you need a fixed version.
const GEMINI_FALLBACK = 'gemini-3.5-flash';
const GEMINI_THINKING_HEADROOM = 4096;

async function gemini(system, messages, maxTokens) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY not set');
  const pinned = process.env.GEMINI_MODEL;
  try {
    return await geminiCall(pinned || 'gemini-flash-latest', key, system, messages, maxTokens);
  } catch (err) {
    // Only when the alias itself is unknown; a pinned model's errors are reported as they are.
    if (pinned || err.status !== 404) throw err;
    return geminiCall(GEMINI_FALLBACK, key, system, messages, maxTokens);
  }
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
    const err = new Error('gemini ' + model + ' ' + res.status + ' ' + (await res.text()).slice(0, 300));
    err.status = res.status;
    throw err;
  }
  const data = await res.json();
  // skip thought-summary parts if a model ever returns them; only the answer is wanted
  const text = (data.candidates?.[0]?.content?.parts || []).filter(p => !p.thought).map(p => p.text || '').join('').trim();
  if (!text) throw new Error('gemini returned no text (finishReason ' + (data.candidates?.[0]?.finishReason || 'none') + ')');
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
  if (!res.ok) throw new Error(cfg.url + ' ' + res.status + ' ' + (await res.text()).slice(0, 300));
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
  if (!res.ok) throw new Error('anthropic ' + res.status + ' ' + (await res.text()).slice(0, 300));
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
