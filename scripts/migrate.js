// Applies db/migrations to the database. Runs on every Vercel build, so a deploy
// brings the schema with it. Skips quietly when no database is attached yet.
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { getDb, databaseUrl } from '../lib/db.js';

if (!databaseUrl()) {
  console.log('migrate: no DATABASE_URL / POSTGRES_URL — skipping. Attach Postgres in Vercel → Storage.');
  process.exit(0);
}
const db = getDb();
await migrate(db, { migrationsFolder: new URL('../db/migrations', import.meta.url).pathname });
console.log('migrate: schema is up to date');
// Answer data for the 63-question deck. Production deploys and local runs only: see migrate-deck.js.
if (!process.env.VERCEL || process.env.VERCEL_ENV === 'production') {
  const { migrateDeck } = await import('./migrate-deck.js');
  const r = await migrateDeck(db);
  console.log(`migrate: deck — ${r.rewritten} of ${r.checked} profiles moved onto the 63-question deck`);
} else {
  console.log(`migrate: deck — skipped on a ${process.env.VERCEL_ENV || 'non-production'} build`);
}
await db.$client.end();
