// Stamps this deploy's id onto the app's script URL in the two page shells, so every deploy
// loads its own copy of the app files instead of one a phone cached earlier. Runs in the
// Vercel build only; locally the placeholder stays and works as a fixed version.
import { readFile, writeFile } from 'node:fs/promises';

const id = process.env.VERCEL_GIT_COMMIT_SHA || process.env.VERCEL_DEPLOYMENT_ID || '';
if (!process.env.VERCEL || !id) {
  console.log('stamp-build: not a Vercel build — leaving the placeholder');
  process.exit(0);
}
const build = id.replace(/[^A-Za-z0-9_-]/g, '').slice(0, 16);
for (const name of ['artisan.html', 'console.html']) {
  const file = new URL(`../public/${name}`, import.meta.url);
  const html = await readFile(file, 'utf8');
  await writeFile(file, html.replaceAll('__KARIGAR_BUILD__', build));
}
console.log(`stamp-build: app files tagged ${build}`);
