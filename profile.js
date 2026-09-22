// Reads one artisan profile by its handover token. Swap the stub for your datastore
// (Vercel Postgres / KV / Supabase). Tokens are opaque and single-artisan scoped.

export const config = { runtime: 'edge' };

export default async function handler(req) {
  const token = new URL(req.url).searchParams.get('token');
  if (!token) return new Response(JSON.stringify({ error: 'token required' }), { status: 400 });

  // TODO: const profile = await db.profiles.findByToken(token)
  const profile = null;

  if (!profile) return new Response(JSON.stringify({ error: 'not found' }), { status: 404 });
  if (profile.revoked) return new Response(JSON.stringify({ error: 'revoked' }), { status: 410 });

  // Never ship facilitator-only fields to the artisan device.
  const { record, lang, analysis, name } = profile;
  return new Response(JSON.stringify({ name, lang, record, analysis }), {
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' }
  });
}
