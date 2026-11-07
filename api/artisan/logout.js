// Ends the artisan's session on this phone.
import { clearArtisanCookie } from '../../lib/artisan-auth.js';
import { json, readJson, route } from '../../lib/http.js';

export const POST = route(async req => {
  await readJson(req); // JSON only, like every other state-changing request
  return json({ ok: true }, 200, { 'set-cookie': clearArtisanCookie() });
});
