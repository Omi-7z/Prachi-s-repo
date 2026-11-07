// Organisation + facilitator creation, shared by self-service sign-up and the CLI script.
import { eq } from 'drizzle-orm';
import { getDb, schema } from './db.js';
import { hashPassword, newId } from './auth.js';
import { BadRequest } from './profiles.js';

const { organisations: O, facilitators: F } = schema;
export const MIN_PASSWORD = 10;

export async function createAccount({ org, name, email, password }) {
  const orgName = String(org || '').trim().slice(0, 200);
  const personName = String(name || '').trim().slice(0, 200);
  const addr = String(email || '').trim().toLowerCase().slice(0, 320);
  if (!orgName || !personName) throw new BadRequest('Organisation and your name are both needed.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr)) throw new BadRequest('That email does not look right.');
  if (String(password || '').length < MIN_PASSWORD) throw new BadRequest(`Password must be at least ${MIN_PASSWORD} characters.`);
  const db = getDb();
  const passwordHash = await hashPassword(password);
  return db.transaction(async tx => {
    if ((await tx.select({ id: F.id }).from(F).where(eq(F.email, addr)).limit(1))[0]) {
      throw new BadRequest('An account with this email already exists. Sign in instead.');
    }
    // Every sign-up gets its own organisation, so nobody can join another team's data by name.
    const o = (await tx.insert(O).values({ id: newId('o_'), name: orgName }).returning())[0];
    const f = (await tx.insert(F).values({ id: newId('f_'), orgId: o.id, name: personName, email: addr, passwordHash }).returning())[0];
    return f;
  });
}

// Adds a colleague to the signed-in facilitator's own organisation, so they see the same
// profiles. The sign-in name can be an email or a plain username.
export const MIN_COLLEAGUE_PASSWORD = 6;
export async function addColleague(fac, { name, login, password }) {
  const personName = String(name || '').trim().slice(0, 200);
  const id = String(login || '').trim().toLowerCase().slice(0, 320);
  if (!personName) throw new BadRequest('Add their name.');
  if (!/^[^\s]{3,320}$/.test(id)) throw new BadRequest('The sign-in name needs at least 3 characters and no spaces.');
  if (String(password || '').length < MIN_COLLEAGUE_PASSWORD) throw new BadRequest(`Password must be at least ${MIN_COLLEAGUE_PASSWORD} characters.`);
  const db = getDb();
  const passwordHash = await hashPassword(password);
  return db.transaction(async tx => {
    if ((await tx.select({ id: F.id }).from(F).where(eq(F.email, id)).limit(1))[0]) throw new BadRequest('That sign-in name is already used. Pick another.');
    const f = (await tx.insert(F).values({ id: newId('f_'), orgId: fac.orgId, name: personName, email: id, passwordHash }).returning())[0];
    return { id: f.id, name: f.name, login: f.email };
  });
}
