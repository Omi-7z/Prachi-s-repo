// Facilitator sign-in. Organisation accounts only; the champion-leader role is deferred.
import { eq } from 'drizzle-orm';
import { getDb, schema } from '../lib/db.js';
import { currentFacilitator, verifyPassword, sessionCookie, clearCookie } from '../lib/auth.js';
import { json, readJson, route } from '../lib/http.js';
import { publicOrigin } from '../lib/origin.js';

export const GET = route(async req => {
  const fac = await currentFacilitator(req);
  if (!fac) return json({ error: 'signed out' }, 401);
  return json({ facilitator: { name: fac.name, email: fac.email, role: fac.role }, org: { id: fac.orgId, name: fac.orgName }, appOrigin: publicOrigin(req) });
});

export const POST = route(async req => {
  const { email, password } = await readJson(req);
  const addr = String(email || '').trim().toLowerCase();
  const rows = addr ? await getDb().select().from(schema.facilitators).where(eq(schema.facilitators.email, addr)).limit(1) : [];
  // Same answer for an unknown email and a wrong password.
  if (!rows[0] || !(await verifyPassword(password, rows[0].passwordHash))) return json({ error: 'Email or password is wrong.' }, 401);
  return json({ ok: true }, 200, { 'set-cookie': sessionCookie(rows[0].id) });
});

export const DELETE = route(async () => json({ ok: true }, 200, { 'set-cookie': clearCookie() }));
