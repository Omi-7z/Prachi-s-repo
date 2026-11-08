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

// /demo-kit: an open page of three QR codes for presentations — the console (via the demo link),
// the demo artisan's app link and the public website. It always shows the demo account's links,
// whoever opens it, so the printed QR codes and this page stay identical. Anyone with this page
// can sign in to that organisation's console.
const DEMO_KIT_FACILITATOR = 'f_iJaonq5x04WrMnEg';
const esc = v => String(v).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
async function demoKit(req) {
  const origin = new URL(req.url).origin;
  const db = getDb();
  const [fac] = await db.select().from(schema.facilitators).where(eq(schema.facilitators.id, DEMO_KIT_FACILITATOR)).limit(1);
  if (!fac) return Response.redirect(origin + '/console', 302);
  const profiles = await db.select().from(schema.artisanProfiles).where(eq(schema.artisanProfiles.orgId, fac.orgId));
  const tokens = await db.select().from(schema.handoverTokens);
  const apps = profiles.map(p => ({ p, t: tokens.find(t => t.profileId === p.id && !t.revokedAt) })).filter(x => x.t && x.p.name);
  // The artisans with an app sign-in are the demo accounts; show only those when there are any.
  const shown = apps.some(x => x.p.username) ? apps.filter(x => x.p.username) : apps;
  const items = [
    { title: 'Organisation console', sub: 'Opens signed in as ' + fac.name, url: origin + '/demo/' + fac.id + '.' + demoMac(fac.id) },
    ...shown.map(({ p, t }) => ({ title: 'Artisan app — ' + ((p.names && p.names.en && p.names.en.name) || p.name), sub: 'Opens their app, no sign-in', url: origin + '/k/' + t.token })),
    { title: 'Website', sub: 'Karigar', url: origin + '/' }
  ];
  const cards = items.map((it, i) => `<section><h2>${esc(it.title)}</h2><p>${esc(it.sub)}</p><div class="q" id="q${i}"></div><a href="${esc(it.url)}">${esc(it.url)}</a></section>`).join('');
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Karigar demo QR codes</title>
<style>body{font-family:'Instrument Sans',system-ui,sans-serif;background:#f6f4ee;color:#10292d;margin:0;padding:24px 16px}h1{font-size:24px;margin:0 0 16px}main{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}section{background:#fff;border:1px solid #e2e0d6;border-radius:16px;padding:18px;display:flex;flex-direction:column;gap:8px;break-inside:avoid}h2{font-size:17px;margin:0}p{margin:0;color:#4d5c5a;font-size:14px}.q svg{width:100%;height:auto}a{font-size:12px;word-break:break-all;color:#10292d}</style></head>
<body><h1>Karigar — demo QR codes</h1><main>${cards}</main>
<script src="https://cdnjs.cloudflare.com/ajax/libs/qrcode-generator/1.4.4/qrcode.min.js"></script>
<script>${JSON.stringify(items.map(i => i.url))}.forEach(function(u,i){var q=qrcode(0,'M');q.addData(u);q.make();document.getElementById('q'+i).innerHTML=q.createSvgTag({cellSize:6,margin:2,scalable:true});});</script></body></html>`;
  return new Response(html, { status: 200, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
}

export const GET = route(async req => {
  const demo = new URL(req.url).searchParams.get('demo');
  if (demo) return demoLogin(req, demo);
  if (new URL(req.url).searchParams.has('kit')) return demoKit(req);
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
