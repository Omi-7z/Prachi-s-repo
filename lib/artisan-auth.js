// Artisan sign-in: a username and password the facilitator sets in the console, as an
// alternative to opening the app from a /k/<token> link. The session is a signed, httpOnly
// cookie. It names the profile and its login version, so resetting the password or removing
// the sign-in ends every session, and switching off the profile's link ends them too.
import { and, desc, eq, gt, lt, sql } from 'drizzle-orm';
import { timingSafeEqual } from 'node:crypto';
import { getDb, schema } from './db.js';
import { sign, verifyPassword, hashPassword, newId } from './auth.js';

const { artisanProfiles: P, handoverTokens: T, loginAttempts: L } = schema;
const COOKIE = 'karigar_artisan';
const MAX_AGE = 60 * 60 * 24 * 90; // 90 days: artisans sign in on their own phone

export const USERNAME = /^[a-z0-9][a-z0-9._-]{2,31}$/;
export const MIN_ARTISAN_PASSWORD = 6;
export const normUsername = u => String(u || '').trim().toLowerCase();

// Rate limit: failed attempts per username and per network address, over a rolling window.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_PER_USER = 8;
const MAX_PER_IP = 40;

export function artisanCookie(profileId, version) {
  const payload = Buffer.from(JSON.stringify({ a: profileId, v: version, exp: Math.floor(Date.now() / 1000) + MAX_AGE })).toString('base64url');
  return `${COOKIE}=${payload}.${sign(payload)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE}`;
}

export const clearArtisanCookie = () => `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;

function readCookie(req) {
  const raw = req.headers.get('cookie') || '';
  const hit = raw.split(/;\s*/).find(c => c.startsWith(COOKIE + '='));
  return hit ? hit.slice(COOKIE.length + 1) : '';
}

// The newest handover token; a revoked one means the facilitator has switched this artisan off.
async function liveToken(db, profileId) {
  const t = (await db.select().from(T).where(eq(T.profileId, profileId)).orderBy(desc(T.version)).limit(1))[0];
  return t && !t.revokedAt ? t : null;
}

// Returns { profileId, tokenId } for a valid artisan session, or null.
export async function currentArtisan(req) {
  const [payload, mac] = readCookie(req).split('.');
  if (!payload || !mac) return null;
  const good = Buffer.from(sign(payload));
  const got = Buffer.from(mac);
  if (good.length !== got.length || !timingSafeEqual(good, got)) return null;
  let data;
  try { data = JSON.parse(Buffer.from(payload, 'base64url').toString()); } catch { return null; }
  if (!data.a || data.exp < Date.now() / 1000) return null;
  const db = getDb();
  const p = (await db.select({ id: P.id, username: P.username, loginVersion: P.loginVersion }).from(P).where(eq(P.id, data.a)).limit(1))[0];
  if (!p || !p.username || p.loginVersion !== data.v) return null;
  const t = await liveToken(db, p.id);
  return t ? { profileId: p.id, tokenId: t.id } : null;
}

function clientAddress(req) {
  return (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || req.headers.get('x-real-ip') || 'unknown';
}

// Compared against when the username does not exist, so a miss takes as long as a wrong password.
let dummyHash = null;

// → { ok: true, profileId, version } or { ok: false, status, error }
export async function loginArtisan(req, username, password) {
  const db = getDb();
  const user = normUsername(username);
  const keys = [`u:${user}`, `ip:${clientAddress(req)}`];
  const since = new Date(Date.now() - WINDOW_MS);
  await db.delete(L).where(lt(L.createdAt, new Date(Date.now() - 24 * 60 * 60 * 1000)));
  const counts = await Promise.all(keys.map(key =>
    db.select({ n: sql`count(*)::int` }).from(L).where(and(eq(L.key, key), gt(L.createdAt, since))).then(r => r[0].n)));
  if (counts[0] >= MAX_PER_USER || counts[1] >= MAX_PER_IP) {
    return { ok: false, status: 429, error: 'Too many tries. Wait 15 minutes, or ask your facilitator to reset your password.' };
  }
  const p = USERNAME.test(user)
    ? (await db.select({ id: P.id, passwordHash: P.passwordHash, loginVersion: P.loginVersion }).from(P).where(eq(P.username, user)).limit(1))[0]
    : null;
  dummyHash = dummyHash || await hashPassword('karigar-timing-pad');
  const ok = await verifyPassword(String(password || ''), (p && p.passwordHash) || dummyHash) && !!(p && p.passwordHash);
  if (!ok) {
    await db.insert(L).values(keys.map(key => ({ id: newId('l_'), key })));
    return { ok: false, status: 401, error: 'That username and password do not match. Check them, or ask your facilitator.' };
  }
  await db.delete(L).where(eq(L.key, keys[0]));
  if (!(await liveToken(db, p.id))) {
    return { ok: false, status: 403, error: 'Your facilitator has switched off this app for now. Ask them to turn it back on.' };
  }
  return { ok: true, profileId: p.id, version: p.loginVersion };
}
