import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema.js';

// Vercel's Postgres (Neon) integration sets DATABASE_URL and POSTGRES_URL; either works.
export function databaseUrl() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || '';
}

let db = null;

export function getDb() {
  if (db) return db;
  const url = databaseUrl();
  if (!url) throw new Error('DATABASE_URL is not set');
  // Serverless: keep the pool tiny; each warm function instance reuses it.
  const pool = new pg.Pool({ connectionString: url, max: 3, idleTimeoutMillis: 10_000 });
  db = drizzle(pool, { schema });
  return db;
}

export { schema };
