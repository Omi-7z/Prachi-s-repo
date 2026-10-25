// Serves the artisan app shell for /k/<token> with that artisan's own manifest already in
// the HTML. Phones read the manifest when the page loads, before any script runs, and
// install the home-screen icon from its start_url. With the shared static manifest the icon
// opened "/", and on iPhone a home-screen app has its own storage, so it could not recover
// the link and landed on the facilitator sign-in instead of the artisan's profile.
import { readFile } from 'node:fs/promises';

// The app files carry this deploy's id, so a phone never reuses an older build's copy
// (scripts/stamp-build.js does the same for the static shells at build time).
const build = (process.env.VERCEL_GIT_COMMIT_SHA || process.env.VERCEL_DEPLOYMENT_ID || 'dev').replace(/[^A-Za-z0-9_-]/g, '').slice(0, 16);
const shell = (await readFile(new URL('../public/artisan.html', import.meta.url), 'utf8')).replaceAll('__KARIGAR_BUILD__', build);

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
