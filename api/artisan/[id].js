// The artisan's username and password sign-in, as one function (Vercel's Hobby plan allows 12
// per deployment):
//   POST /api/artisan/login    { username, password } → sets an httpOnly session cookie;
//                              failed attempts are rate-limited per username and per address
//   POST /api/artisan/logout   clears it
//   GET  /api/artisan/session  the signed-in artisan's own profile (the artisan-safe view a
//                              /k/<token> link gets)
import { loginArtisan, artisanCookie, clearArtisanCookie, currentArtisan } from '../../lib/artisan-auth.js';
import { artisanProfile } from '../../lib/profiles.js';
import { json, readJson, route } from '../../lib/http.js';

const op = req => new URL(req.url).pathname.split('/').filter(Boolean).pop();

export const GET = route(async req => {
  if (op(req) !== 'session') return json({ error: 'not found' }, 404);
  const who = await currentArtisan(req);
  if (!who) return json({ error: 'signed out' }, 401);
  const profile = await artisanProfile(who.profileId, who.tokenId);
  return profile ? json({ profile }) : json({ error: 'signed out' }, 401);
});

export const POST = route(async req => {
  const which = op(req);
  if (which === 'login') {
    const { username, password } = await readJson(req);
    const r = await loginArtisan(req, username, password);
    if (!r.ok) return json({ error: r.error }, r.status);
    return json({ ok: true }, 200, { 'set-cookie': artisanCookie(r.profileId, r.version) });
  }
  if (which === 'logout') {
    await readJson(req); // JSON only, like every other state-changing request
    return json({ ok: true }, 200, { 'set-cookie': clearArtisanCookie() });
  }
  return json({ error: 'not found' }, 404);
});
