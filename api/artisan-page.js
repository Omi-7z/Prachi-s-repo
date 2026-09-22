// Serves the artisan app shell for /k/<token> with that artisan's own manifest already in
// the HTML. Phones read the manifest when the page loads, before any script runs, and
// install the home-screen icon from its start_url. With the shared static manifest the icon
// opened "/", and on iPhone a home-screen app has its own storage, so it could not recover
// the link and landed on the facilitator sign-in instead of the artisan's profile.
import { readFile } from 'node:fs/promises';

const shell = await readFile(new URL('../public/artisan.html', import.meta.url), 'utf8');

export async function GET(req) {
  const t = new URL(req.url).searchParams.get('t') || '';
  // Tokens are URL-safe base64; anything else never reaches the HTML.
  const html = /^[A-Za-z0-9_-]{8,64}$/.test(t)
    ? shell.replace('href="/manifest.webmanifest"', `href="/api/manifest?t=${t}"`)
    : shell;
  return new Response(html, {
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' }
  });
}
