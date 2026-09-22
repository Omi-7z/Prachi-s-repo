import { BadRequest } from './profiles.js';

export function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...headers }
  });
}

// Mutating console requests must be JSON. A cross-site form cannot send that content type
// without a CORS preflight, which is what keeps the SameSite=Lax session cookie safe.
export async function readJson(req) {
  if (!(req.headers.get('content-type') || '').includes('application/json')) throw new BadRequest('expected application/json');
  try { return await req.json(); } catch { throw new BadRequest('bad JSON'); }
}

// Wraps a handler so validation errors become 400s and nothing else leaks a stack trace.
export const route = fn => async req => {
  try {
    return await fn(req);
  } catch (e) {
    if (e instanceof BadRequest) return json({ error: e.message }, 400);
    console.error(e);
    return json({ error: 'server error' }, 500);
  }
};
