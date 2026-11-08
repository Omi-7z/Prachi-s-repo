// Facilitator sign-in. Organisation accounts only; the champion-leader role is deferred.
import { eq } from 'drizzle-orm';
import { getDb, schema } from '../lib/db.js';
import { timingSafeEqual } from 'node:crypto';
import { currentFacilitator, verifyPassword, sessionCookie, clearCookie, sign } from '../lib/auth.js';
import { json, readJson, route } from '../lib/http.js';
import { publicOrigin } from '../lib/origin.js';

// Demo sign-in link for presentations: /demo/<facilitatorId>.<mac>. The mac is an HMAC of the
// facilitator id under SESSION_SECRET, so only someone holding the secret can mint one, and
// rotating SESSION_SECRET revokes every link (and every session) at once.
export const demoMac = id => sign('demo-login:' + id).slice(0, 22);
async function demoLogin(req, code) {
  const [id, mac] = String(code).split('.');
  const back = new URL('/console', req.url).toString();
  if (!id || !mac || mac.length !== 22 || !timingSafeEqual(Buffer.from(mac), Buffer.from(demoMac(id)))) return Response.redirect(back, 302);
  const rows = await getDb().select().from(schema.facilitators).where(eq(schema.facilitators.id, id)).limit(1);
  if (!rows[0]) return Response.redirect(back, 302);
  return new Response(null, { status: 302, headers: { location: back, 'cache-control': 'no-store', 'set-cookie': sessionCookie(rows[0].id) } });
}

export const GET = route(async req => {
  const demo = new URL(req.url).searchParams.get('demo');
  if (demo) return demoLogin(req, demo);
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
