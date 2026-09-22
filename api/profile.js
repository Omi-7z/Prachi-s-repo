// Reads one artisan profile by its handover token. The token is the artisan's only credential:
// 404 when it never existed, 410 when it was revoked or replaced by a newer link.
import { resolveToken } from '../lib/auth.js';
import { artisanProfile } from '../lib/profiles.js';
import { json, route } from '../lib/http.js';

export const GET = route(async req => {
  const token = new URL(req.url).searchParams.get('token');
  if (!token) return json({ error: 'token required' }, 400);
  const hit = await resolveToken(token);
  if (hit.status === 404) return json({ error: 'not found' }, 404);
  if (hit.status === 410) return json({ error: 'revoked' }, 410);
  const profile = await artisanProfile(hit.profileId, hit.tokenId);
  return profile ? json({ profile }) : json({ error: 'not found' }, 404);
});
