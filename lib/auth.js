import { scrypt, randomBytes, timingSafeEqual, createHmac } from 'node:crypto';
import { promisify } from 'node:util';
import { eq } from 'drizzle-orm';
import { getDb, schema } from './db.js';

const scryptAsync = promisify(scrypt);
const COOKIE = 'karigar_session';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function hashPassword(password) {
  const salt = randomBytes(16);
  const key = await scryptAsync(String(password), salt, 64);
  return `scrypt$${salt.toString('base64url')}$${key.toString('base64url')}`;
}

export async function verifyPassword(password, stored) {
  const [alg, salt, hash] = String(stored || '').split('$');
  if (alg !== 'scrypt' || !salt || !hash) return false;
  const expected = Buffer.from(hash, 'base64url');
  const key = await scryptAsync(String(password), Buffer.from(salt, 'base64url'), expected.length);
  return timingSafeEqual(key, expected);
}

export const newId = (prefix = '') => prefix + randomBytes(12).toString('base64url');
// Handover tokens are the artisan's only credential: random, URL-safe, no meaning. 72 bits
// (12 characters) keeps the link short enough to read out or type, and is still far beyond
// guessing: at a thousand tries a second it would take longer than the age of the universe.
export const newToken = () => randomBytes(9).toString('base64url');

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error('SESSION_SECRET must be set (32+ characters)');
  return s;
}

const sign = payload => createHmac('sha256', secret()).update(payload).digest('base64url');

export function sessionCookie(facilitatorId) {
  const payload = Buffer.from(JSON.stringify({ f: facilitatorId, exp: Math.floor(Date.now() / 1000) + MAX_AGE })).toString('base64url');
  return `${COOKIE}=${payload}.${sign(payload)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE}`;
}

export const clearCookie = () => `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;

function readCookie(req) {
  const raw = req.headers.get('cookie') || '';
  const hit = raw.split(/;\s*/).find(c => c.startsWith(COOKIE + '='));
  return hit ? hit.slice(COOKIE.length + 1) : '';
}

// Returns { id, orgId, name, email, role, orgName } or null.
export async function currentFacilitator(req) {
  const value = readCookie(req);
  const [payload, mac] = value.split('.');
  if (!payload || !mac) return null;
  const good = Buffer.from(sign(payload));
  const got = Buffer.from(mac);
  if (good.length !== got.length || !timingSafeEqual(good, got)) return null;
  let data;
  try { data = JSON.parse(Buffer.from(payload, 'base64url').toString()); } catch { return null; }
  if (!data.f || data.exp < Date.now() / 1000) return null;
  const db = getDb();
  const rows = await db.select({
    id: schema.facilitators.id, orgId: schema.facilitators.orgId, name: schema.facilitators.name,
    email: schema.facilitators.email, role: schema.facilitators.role, orgName: schema.organisations.name
  }).from(schema.facilitators)
    .innerJoin(schema.organisations, eq(schema.organisations.id, schema.facilitators.orgId))
    .where(eq(schema.facilitators.id, data.f)).limit(1);
  return rows[0] || null;
}

// A live (unrevoked) handover token → { tokenId, profileId }, or a status explaining why not.
export async function resolveToken(token) {
  if (!token || typeof token !== 'string' || token.length > 64) return { status: 404 };
  const db = getDb();
  const rows = await db.select().from(schema.handoverTokens).where(eq(schema.handoverTokens.token, token)).limit(1);
  const row = rows[0];
  if (!row) return { status: 404 };
  // Issuing a new link revokes every older one, so a revoked row covers both cases.
  if (row.revokedAt) return { status: 410 };
  return { status: 200, tokenId: row.id, profileId: row.profileId };
}
