export default {
  dialect: 'postgresql',
  schema: './lib/schema.js',
  out: './db/migrations',
  dbCredentials: { url: process.env.DATABASE_URL || process.env.POSTGRES_URL }
};
