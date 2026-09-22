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
await db.$client.end();
