// Stamps this deploy's id onto the app's script URL in the page shells, so every deploy
// loads its own copy of the app files instead of one a phone cached earlier, and the public
// address (lib/origin.js) onto the website's links and share tags. Runs in the Vercel build
// only; locally the placeholders stay, the build id works as a fixed version, and the dev
// server fills in the address.
import { readFile, writeFile } from 'node:fs/promises';
import { configuredOrigin } from '../lib/origin.js';

const id = process.env.VERCEL_GIT_COMMIT_SHA || process.env.VERCEL_DEPLOYMENT_ID || '';
if (!process.env.VERCEL || !id) {
  console.log('stamp-build: not a Vercel build — leaving the placeholders');
  process.exit(0);
}
const build = id.replace(/[^A-Za-z0-9_-]/g, '').slice(0, 16);
const origin = configuredOrigin();
for (const name of ['artisan.html', 'console.html', 'index.html']) {
  const file = new URL(`../public/${name}`, import.meta.url);
  const html = await readFile(file, 'utf8');
  await writeFile(file, html.replaceAll('__KARIGAR_BUILD__', build).replaceAll('__KARIGAR_ORIGIN__', origin));
}
console.log(`stamp-build: app files tagged ${build}; public address ${origin || '(none set — pages use their own)'}`);
