// One profile, scoped to the signed-in facilitator's organisation.
//   PUT    save the editable parts (creates the profile and its first handover link if new)
//   POST   { action: 'revoke' | 'restore' | 'new-link' | 'reset-practice' }
//   DELETE remove the profile; its link stops working immediately
import { currentFacilitator } from '../../lib/auth.js';
import { saveProfile, deleteProfile, profileAction, validId } from '../../lib/profiles.js';
import { json, readJson, route } from '../../lib/http.js';

const idOf = req => decodeURIComponent(new URL(req.url).pathname.split('/').filter(Boolean).pop() || '');

const withFacilitator = fn => route(async req => {
  const fac = await currentFacilitator(req);
  if (!fac) return json({ error: 'signed out' }, 401);
  const id = idOf(req);
  if (!validId(id)) return json({ error: 'bad id' }, 400);
  return fn(req, fac, id);
});

export const PUT = withFacilitator(async (req, fac, id) => {
  const body = await readJson(req);
  return json({ profile: await saveProfile(fac, id, body) });
});

export const POST = withFacilitator(async (req, fac, id) => {
  const { action } = await readJson(req);
  const profile = await profileAction(fac.orgId, id, action);
  return profile ? json({ profile }) : json({ error: 'not found' }, 404);
});

export const DELETE = withFacilitator(async (req, fac, id) => {
  // readJson enforces the JSON content type, which is the CSRF guard for this verb too.
  await readJson(req);
  return (await deleteProfile(fac.orgId, id)) ? json({ ok: true }) : json({ error: 'not found' }, 404);
});
