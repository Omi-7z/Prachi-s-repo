// A signed-in facilitator adds a colleague to their own organisation.
//   POST { name, login, password }   login is an email or a plain username
import { currentFacilitator } from '../lib/auth.js';
import { addColleague } from '../lib/accounts.js';
import { json, readJson, route } from '../lib/http.js';

export const POST = route(async req => {
  const fac = await currentFacilitator(req);
  if (!fac) return json({ error: 'signed out' }, 401);
  return json({ colleague: await addColleague(fac, await readJson(req)) });
});
