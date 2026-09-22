// Profile persistence. Rows ↔ the profile object the prototype already works with:
// { id, record, sources, lang, analysis, checked, sessionNote, origin, approved, cluster,
//   rooms, openedDaysAgo, revoked, linkVersion, token }
import { and, eq, inArray, desc, sql } from 'drizzle-orm';
import { getDb, schema } from './db.js';
import { newId, newToken } from './auth.js';
import { FIELD_INDEX } from '../public/karigar-data.js';

const { artisanProfiles: P, cardAnswers: A, handoverTokens: T, practiceEvents: E } = schema;

const DAY = 24 * 60 * 60 * 1000;
const MAX_VALUE = 20_000;
const MAX_JSON = 200_000;

export const validId = id => typeof id === 'string' && /^[A-Za-z0-9_-]{1,64}$/.test(id);

export class BadRequest extends Error {}

const str = (v, max = MAX_VALUE) => (typeof v === 'string' ? v : v == null ? '' : String(v)).slice(0, max);

function jsonOrNull(v) {
  if (v == null) return null;
  if (typeof v !== 'object') throw new BadRequest('analysis must be an object');
  if (JSON.stringify(v).length > MAX_JSON) throw new BadRequest('analysis too large');
  return v;
}

// Everything the console needs for the given profile ids, in the prototype's shape.
async function hydrate(db, rows) {
  if (!rows.length) return [];
  const ids = rows.map(r => r.id);
  const now = Date.now();
  const [answers, tokens, rooms] = await Promise.all([
    db.select().from(A).where(inArray(A.profileId, ids)),
    db.select().from(T).where(inArray(T.profileId, ids)).orderBy(desc(T.version)),
    db.select({ profileId: E.profileId, segmentId: E.segmentId, n: sql`count(*)::int`, last: sql`max(${E.createdAt})` })
      .from(E).where(inArray(E.profileId, ids)).groupBy(E.profileId, E.segmentId)
  ]);
  const daysAgo = t => (t ? Math.floor((now - new Date(t).getTime()) / DAY) : null);
  return rows.map(r => {
    const record = {}, sources = {};
    answers.filter(a => a.profileId === r.id).forEach(a => {
      record[a.fieldKey] = a.value;
      if (a.sourceQuote) sources[a.fieldKey] = a.sourceQuote;
    });
    const toks = tokens.filter(t => t.profileId === r.id);
    const live = toks[0] || null;
    // "Last opened" is across every link this artisan has had, not just the current one.
    const opened = toks.map(t => t.lastOpenedAt).filter(Boolean).sort((x, y) => y - x)[0];
    const roomCounts = {};
    let practiced = null;
    rooms.filter(x => x.profileId === r.id).forEach(x => {
      roomCounts[x.segmentId] = x.n;
      if (!practiced || new Date(x.last) > new Date(practiced)) practiced = x.last;
    });
    return {
      id: r.id, record, sources, lang: r.lang, analysis: r.analysis || null,
      checked: r.checklist || {}, sessionNote: r.sessionNote || '', origin: r.origin || undefined,
      approved: !!r.approvedAt, cluster: r.cluster || undefined,
      rooms: roomCounts,
      openedDaysAgo: daysAgo(opened), practicedDaysAgo: daysAgo(practiced),
      revoked: !live || !!live.revokedAt, linkVersion: live ? live.version : 1,
      token: live ? live.token : null
    };
  });
}

export async function listProfiles(orgId) {
  const db = getDb();
  const rows = await db.select().from(P).where(eq(P.orgId, orgId)).orderBy(P.createdAt);
  return hydrate(db, rows);
}

export async function getProfile(orgId, id) {
  const db = getDb();
  const rows = await db.select().from(P).where(and(eq(P.orgId, orgId), eq(P.id, id))).limit(1);
  return (await hydrate(db, rows))[0] || null;
}

// Create or update the facilitator-editable parts of a profile. Handover links and practice
// counts are not writable here — they change only through profileAction().
export async function saveProfile(fac, id, body) {
  if (!validId(id)) throw new BadRequest('bad id');
  const db = getDb();
  const record = body.record && typeof body.record === 'object' ? body.record : {};
  const sources = body.sources && typeof body.sources === 'object' ? body.sources : {};
  const answers = Object.keys(record)
    .filter(k => FIELD_INDEX[k] && str(record[k]).trim())
    .map(k => ({ profileId: id, fieldKey: k, value: str(record[k]), sourceQuote: sources[k] ? str(sources[k]) : null }));
  const lang = /^[a-z]{2,3}$/.test(body.lang || '') ? body.lang : 'en';
  const values = {
    name: str(record.artisan_name, 300), craftLocal: str(record.craft_name_local, 300), region: str(record.craft_region, 300),
    lang, cluster: body.cluster ? str(body.cluster, 300) : null,
    analysis: jsonOrNull(body.analysis),
    checklist: body.checked && typeof body.checked === 'object' ? body.checked : {},
    sessionNote: str(body.sessionNote, 4000), origin: body.origin ? str(body.origin, 300) : null,
    updatedAt: new Date()
  };

  await db.transaction(async tx => {
    const existing = (await tx.select({ orgId: P.orgId, approvedAt: P.approvedAt }).from(P).where(eq(P.id, id)).limit(1))[0];
    if (existing && existing.orgId !== fac.orgId) throw new BadRequest('bad id');
    // Approval is a moment, not a flag: keep the original time while it stays approved.
    const approvedAt = body.approved ? (existing && existing.approvedAt) || new Date() : null;
    if (existing) {
      await tx.update(P).set({ ...values, approvedAt }).where(eq(P.id, id));
    } else {
      await tx.insert(P).values({ id, orgId: fac.orgId, createdBy: fac.id, ...values, approvedAt });
      await tx.insert(T).values({ id: newId('t_'), profileId: id, token: newToken(), version: 1 });
    }
    await tx.delete(A).where(eq(A.profileId, id));
    if (answers.length) await tx.insert(A).values(answers);
  });
  return getProfile(fac.orgId, id);
}

export async function deleteProfile(orgId, id) {
  const db = getDb();
  const gone = await db.delete(P).where(and(eq(P.orgId, orgId), eq(P.id, id))).returning({ id: P.id });
  return gone.length > 0;
}

export async function profileAction(orgId, id, action) {
  const db = getDb();
  const owned = (await db.select({ id: P.id }).from(P).where(and(eq(P.orgId, orgId), eq(P.id, id))).limit(1))[0];
  if (!owned) return null;
  const latest = (await db.select().from(T).where(eq(T.profileId, id)).orderBy(desc(T.version)).limit(1))[0];
  if (action === 'revoke') {
    if (latest) await db.update(T).set({ revokedAt: new Date() }).where(eq(T.id, latest.id));
  } else if (action === 'restore') {
    if (latest) await db.update(T).set({ revokedAt: null }).where(eq(T.id, latest.id));
  } else if (action === 'new-link') {
    // Retire every older link, then issue a fresh opaque token.
    await db.transaction(async tx => {
      await tx.update(T).set({ revokedAt: new Date() }).where(and(eq(T.profileId, id), sql`${T.revokedAt} is null`));
      await tx.insert(T).values({ id: newId('t_'), profileId: id, token: newToken(), version: (latest ? latest.version : 0) + 1 });
    });
  } else if (action === 'reset-practice') {
    await db.delete(E).where(eq(E.profileId, id));
  } else {
    throw new BadRequest('unknown action');
  }
  return getProfile(orgId, id);
}

// What the artisan's own phone receives. Facilitator-only working state (handover checklist,
// session note, transcript source lines, care notes meant for brands) never leaves the server.
export async function artisanProfile(profileId, tokenId) {
  const db = getDb();
  await db.update(T).set({ lastOpenedAt: new Date() }).where(eq(T.id, tokenId));
  const rows = await db.select().from(P).where(eq(P.id, profileId)).limit(1);
  const p = (await hydrate(db, rows))[0];
  if (!p) return null;
  let analysis = null;
  if (p.analysis) {
    const { care_notes, ...rest } = p.analysis;
    analysis = rest;
  }
  return { id: p.id, lang: p.lang, record: p.record, analysis, rooms: p.rooms };
}

export const SEGMENTS = new Set(['brand', 'genz', 'social', 'ngo', 'exhibition', 'custom']);

export async function recordPractice(profileId, segmentId) {
  const db = getDb();
  await db.insert(E).values({ id: newId('e_'), profileId, segmentId });
}
