// Per-artisan web manifest. Android installs from the manifest's start_url, so it has to
// carry the artisan's own link — a shared "/" start_url would open with no profile.
import { readFile } from 'node:fs/promises';
import { json } from '../lib/http.js';

const base = JSON.parse(await readFile(new URL('../public/manifest.webmanifest', import.meta.url), 'utf8'));

export async function GET(req) {
  const q = new URL(req.url).searchParams;
  const t = q.get('t') || '';
  // /app is the artisan's sign-in entry; installed from there, the icon opens /app again
  const app = q.get('app') === '1';
  if (!app && !/^[A-Za-z0-9_-]{8,64}$/.test(t)) return json({ error: 'bad token' }, 400);
  const manifest = app ? { ...base, id: '/app', start_url: '/app?src=a2hs' } : { ...base, id: `/k/${t}`, start_url: `/k/${t}?src=a2hs` };
  return new Response(JSON.stringify(manifest), {
    headers: { 'content-type': 'application/manifest+json', 'cache-control': 'no-store' }
  });
}
