// Vercel serverless proxy to Anthropic. The artisan app never sees the API key.
// Set ANTHROPIC_API_KEY in Vercel → Project → Settings → Environment Variables.

export const config = { runtime: 'edge' };

const ALLOWED_MODELS = new Set(['claude-sonnet-4-5', 'claude-haiku-4-5']);

export default async function handler(req) {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

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
    body: JSON.stringify({ model, max_tokens, system, messages })
  });

  if (!res.ok) return json({ error: 'upstream', detail: await res.text() }, res.status);

  const data = await res.json();
  const text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
  return json({ text });
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json' } });
}
