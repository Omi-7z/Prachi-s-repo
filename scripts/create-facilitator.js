// Creates a facilitator account, and the organisation if it does not exist yet.
//   DATABASE_URL=... npm run facilitator -- --org "Craft Lab" --name "Asha" --email asha@example.org
// The password is read from KARIGAR_PASSWORD, or prompted for, so it stays out of shell history.
// Joins the organisation with that exact name if it exists, so this also adds a colleague.
//
// --email takes any sign-in name; the console's sign-in accepts an email or a plain username.
// --allow-short-password lets one deliberate account (such as a shared test login) have a
// password under 10 characters. Anyone who knows it can use that organisation's console.
import { parseArgs } from 'node:util';
import { createInterface } from 'node:readline/promises';
import { eq } from 'drizzle-orm';
import { getDb, schema } from '../lib/db.js';
import { hashPassword, newId } from '../lib/auth.js';

const { values: a } = parseArgs({ options: { org: { type: 'string' }, name: { type: 'string' }, email: { type: 'string' }, 'allow-short-password': { type: 'boolean' } } });
if (!a.org || !a.name || !a.email) {
  console.error('usage: npm run facilitator -- --org "Organisation" --name "Name" --email you@example.org');
  process.exit(1);
}

let password = process.env.KARIGAR_PASSWORD;
if (!password) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  password = await rl.question('Password (10+ characters): ');
  rl.close();
}
if (!password) { console.error('A password is needed.'); process.exit(1); }
if (password.length < 10 && !a['allow-short-password']) { console.error('Password must be at least 10 characters (or pass --allow-short-password for a test account).'); process.exit(1); }
if (password.length < 10) console.warn('Warning: short password. Anyone who knows it can use this organisation\'s console.');

const db = getDb();
const { organisations: O, facilitators: F } = schema;
let org = (await db.select().from(O).where(eq(O.name, a.org)).limit(1))[0];
if (!org) {
  org = (await db.insert(O).values({ id: newId('o_'), name: a.org }).returning())[0];
  console.log(`Created organisation "${org.name}"`);
}
const email = a.email.trim().toLowerCase();
const existing = (await db.select().from(F).where(eq(F.email, email)).limit(1))[0];
if (existing) {
  await db.update(F).set({ passwordHash: await hashPassword(password), name: a.name }).where(eq(F.id, existing.id));
  console.log(`Updated ${email} (password reset)`);
} else {
  await db.insert(F).values({ id: newId('f_'), orgId: org.id, name: a.name, email, passwordHash: await hashPassword(password) });
  console.log(`Created ${email} in "${org.name}"`);
}
await db.$client.end();
