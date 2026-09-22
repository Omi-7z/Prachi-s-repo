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
//   groq       Groq free tier. Very fast, weaker on Hindi/Gujarati/Marathi.
//   openrouter OpenRouter's `:free` models. Handy fallback, availability varies.
//   anthropic  Paid. Only reachable if you set PROVIDER=anthropic yourself.
//
// Swapping providers is an env var. The request and response shape never changes, so the
// front end does not care which one is live.

export const config = { runtime: 'edge' };

const PROVIDER = (process.env.PROVIDER || 'demo').toLowerCase();

// Hard ceilings, applied before any provider is called.
const MAX_OUTPUT_TOKENS = 2000;
const MAX_INPUT_CHARS = 60000;

export default async function handler(req) {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
  if (process.env.KARIGAR_PAUSED === '1') return json({ error: 'paused' }, 503);

  let body;
  try { body = await req.json(); } catch { return json({ error: 'Bad JSON' }, 400); }

  const { system = '', messages } = body || {};
  if (!Array.isArray(messages) || !messages.length) return json({ error: 'messages required' }, 400);

  const maxTokens = Math.min(Number(body.max_tokens) || 1200, MAX_OUTPUT_TOKENS);
  const inputChars = system.length + messages.reduce((n, m) => n + String(m.content || '').length, 0);
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
    return json({ error: 'upstream', provider: PROVIDER, detail: String(err && err.message || err) }, 502);
  }
}

// ── Google AI Studio (free tier) ────────────────────────────────────────────────
// Free tier is metered by requests per minute and per day, not by money.
// Get a key at aistudio.google.com/apikey — no billing account required.
async function gemini(system, messages, maxTokens) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY not set');
  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: system ? { parts: [{ text: system }] } : undefined,
        contents: messages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: String(m.content || '') }]
        })),
        generationConfig: { maxOutputTokens: maxTokens, temperature: 0.8 }
      })
    }
  );
  if (!res.ok) throw new Error('gemini ' + res.status + ' ' + (await res.text()).slice(0, 300));
  const data = await res.json();
  return (data.candidates?.[0]?.content?.parts || []).map(p => p.text || '').join('').trim();
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
  const allowed = new Set(['claude-sonnet-4-5', 'claude-haiku-4-5']);
  const chosen = allowed.has(model) ? model : 'claude-haiku-4-5';   // cheapest by default
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

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
}
