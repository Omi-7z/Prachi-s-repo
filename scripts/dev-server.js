// Local stand-in for Vercel: serves public/, applies the vercel.json rewrites, and runs
// the api/ functions with Web Request/Response, the same way the Node runtime does.
//   DATABASE_URL=postgres://... SESSION_SECRET=... ANTHROPIC_API_KEY=... npm run dev
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const PORT = Number(process.env.PORT || 3000);
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.svg': 'image/svg+xml', '.css': 'text/css' };

function apiFile(pathname) {
  const parts = pathname.replace(/^\/api\//, '').split('/').filter(Boolean);
  const direct = join(root, 'api', ...parts) + '.js';
  if (existsSync(direct)) return direct;
  const index = join(root, 'api', ...parts, 'index.js');
  if (existsSync(index)) return index;
  const dynamic = join(root, 'api', ...parts.slice(0, -1), '[id].js');
  return existsSync(dynamic) ? dynamic : null;
}

function rewrite(pathname) {
  if (/^\/k\/[^/]+\/?$/.test(pathname)) return '/index.html';
  if (/^\/org(\/.*)?$/.test(pathname)) return '/console.html';
  if (pathname === '/') return '/index.html';
  return pathname;
}

async function serveApi(req, res, url) {
  const file = apiFile(url.pathname);
  if (!file) { res.writeHead(404).end('no such function'); return; }
  const mod = await import(file);
  const handler = mod[req.method];
  if (!handler) { res.writeHead(405).end('Method not allowed'); return; }
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const body = chunks.length ? Buffer.concat(chunks) : undefined;
  const request = new Request(url, { method: req.method, headers: req.headers, body: ['GET', 'HEAD'].includes(req.method) ? undefined : body, duplex: 'half' });
  const response = await handler(request);
  const headers = {};
  response.headers.forEach((v, k) => { headers[k] = v; });
  // Local http: drop Secure so the browser keeps the session cookie on localhost.
  if (headers['set-cookie']) headers['set-cookie'] = headers['set-cookie'].replace('; Secure', '');
  res.writeHead(response.status, headers).end(Buffer.from(await response.arrayBuffer()));
}

async function serveStatic(res, url) {
  let path = rewrite(url.pathname);
  let file = normalize(join(root, 'public', path));
  if (!file.startsWith(join(root, 'public'))) { res.writeHead(403).end(); return; }
  if (!existsSync(file) && existsSync(file + '.html')) file += '.html'; // cleanUrls
  try {
    if (!(await stat(file)).isFile()) throw new Error('dir');
    res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream', 'cache-control': 'no-cache' }).end(await readFile(file));
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' }).end('Not found');
  }
}

createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  try {
    if (url.pathname.startsWith('/api/')) await serveApi(req, res, url);
    else await serveStatic(res, url);
  } catch (e) {
    console.error(e);
    if (!res.headersSent) res.writeHead(500).end('server error');
  }
}).listen(PORT, () => console.log(`Karigar dev server on http://localhost:${PORT}  (console: /org)`));
