// Counts one practice conversation. Only which audience was opened is stored —
// what was said never leaves the artisan's phone, and this endpoint cannot accept it.
import { resolveToken } from '../lib/auth.js';
import { recordPractice, SEGMENTS } from '../lib/profiles.js';
import { json, readJson, route } from '../lib/http.js';

export const POST = route(async req => {
  const { token, segment } = await readJson(req);
  const hit = await resolveToken(token);
  if (hit.status !== 200) return json({ error: hit.status === 410 ? 'revoked' : 'not found' }, hit.status);
  if (!SEGMENTS.has(segment)) return json({ error: 'unknown segment' }, 400);
  await recordPractice(hit.profileId, segment);
  return json({ ok: true });
});
