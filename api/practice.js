// Counts one practice conversation. Only which audience was opened is stored —
// what was said never leaves the artisan's phone, and this endpoint cannot accept it.
import { resolveToken } from '../lib/auth.js';
import { currentArtisan } from '../lib/artisan-auth.js';
import { recordPractice, SEGMENTS } from '../lib/profiles.js';
import { json, readJson, route } from '../lib/http.js';

export const POST = route(async req => {
  const { token, segment } = await readJson(req);
  let profileId;
  if (token) {
    // opened from a /k/<token> link
    const hit = await resolveToken(token);
    if (hit.status !== 200) return json({ error: hit.status === 410 ? 'revoked' : 'not found' }, hit.status);
    profileId = hit.profileId;
  } else {
    // signed in at /app
    const who = await currentArtisan(req);
    if (!who) return json({ error: 'signed out' }, 401);
    profileId = who.profileId;
  }
  if (!SEGMENTS.has(segment)) return json({ error: 'unknown segment' }, 400);
  await recordPractice(profileId, segment);
  return json({ ok: true });
});
