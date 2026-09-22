// Serverless proxy to Anthropic. The artisan app never sees the API key.
// Set ANTHROPIC_API_KEY in Vercel → Project → Settings → Environment Variables.
// Callers must be a signed-in facilitator or hold a live handover token — an open
// proxy would let anyone spend the organisation's key.
import { currentFacilitator, resolveToken } from '../lib/auth.js';
import { json, route } from '../lib/http.js';

const ALLOWED_MODELS = new Set(['claude-sonnet-4-5', 'claude-haiku-4-5']);

async function allowed(req) {
  const token = req.headers.get('x-karigar-token');
  if (token) return (await resolveToken(token)).status === 200;
  return !!(await currentFacilitator(req));
}

export const POST = route(async req => {
  if (!(await allowed(req))) return json({ error: 'unauthorised' }, 401);

  let body;
  try { body = await req.json(); } catch { return json({ error: 'Bad JSON' }, 400); }

  const { system, messages, model = 'claude-sonnet-4-5', max_tokens = 1200 } = body || {};
  if (!Array.isArray(messages) || !messages.length) return json({ error: 'messages required' }, 400);
  if (!ALLOWED_MODELS.has(model)) return json({ error: 'model not allowed' }, 400);

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({ model, max_tokens: Math.min(Number(max_tokens) || 1200, 8000), system, messages })
  });

  if (!res.ok) return json({ error: 'upstream', detail: await res.text() }, res.status);

  const data = await res.json();
  const text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
  return json({ text });
});
