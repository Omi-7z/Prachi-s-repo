// Every profile in the signed-in facilitator's organisation.
import { currentFacilitator } from '../../lib/auth.js';
import { listProfiles } from '../../lib/profiles.js';
import { json, route } from '../../lib/http.js';

export const GET = route(async req => {
  const fac = await currentFacilitator(req);
  if (!fac) return json({ error: 'signed out' }, 401);
  return json({ profiles: await listProfiles(fac.orgId) });
});
