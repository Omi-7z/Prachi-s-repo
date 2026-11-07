// Artisan sign-in with the username and password their facilitator set. Sets an httpOnly
// session cookie; failed attempts are rate-limited per username and per network address.
import { loginArtisan, artisanCookie } from '../../lib/artisan-auth.js';
import { json, readJson, route } from '../../lib/http.js';

export const POST = route(async req => {
  const { username, password } = await readJson(req);
  const r = await loginArtisan(req, username, password);
  if (!r.ok) return json({ error: r.error }, r.status);
  return json({ ok: true }, 200, { 'set-cookie': artisanCookie(r.profileId, r.version) });
});
