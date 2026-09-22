// Karigar service worker.
// App shell is precached so the artisan app opens offline; model calls always hit the network.
const VERSION = 'karigar-v2';
const SHELL = [
  '/', '/manifest.webmanifest',
  '/runtime.js', '/vendor/preact.mjs', '/karigar.dc', '/karigar-data.js', '/karigar-i18n.js',
  '/icons/icon-192.png', '/icons/icon-512.png', '/icons/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  // never cache the model proxy or profile reads
  if (url.pathname.startsWith('/api/')) return;

  // the facilitator console is online-only and must never become the artisan's offline shell
  if (url.pathname === '/org' || url.pathname.startsWith('/org/') || url.pathname.startsWith('/console')) return;

  // navigations: network first so a new profile is picked up, shell as the offline fallback
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(VERSION).then(c => c.put('/', copy));
        }
        return res;
      }).catch(() => caches.match('/'))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok && res.type === 'basic') {
        const copy = res.clone();
        caches.open(VERSION).then(c => c.put(req, copy));
      }
      return res;
    }))
  );
});
