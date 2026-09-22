// Karigar service worker.
//
// It serves the artisan app only (/k/<token>): the shell is precached so an artisan's board
// opens without internet. The facilitator platform at / and /org is online-only and is never
// intercepted, so it can never be replaced by a cached artisan page. Model calls and every
// other /api request always go to the network.
const VERSION = 'karigar-v3';
// /k/shell is the artisan page with no valid token: the plain app shell, used offline
const SHELL_PAGE = '/k/shell';
const SHELL = [
  SHELL_PAGE, '/manifest.webmanifest',
  '/runtime.js', '/vendor/preact.mjs', '/karigar.dc', '/karigar-data.js', '/karigar-i18n.js',
  '/icons/icon-192.png', '/icons/icon-512.png', '/icons/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  // drops the v1/v2 caches, which stored an artisan page under "/"
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
  if (url.pathname.startsWith('/api/')) return;

  if (req.mode === 'navigate') {
    // only the artisan app works offline; every other page goes straight to the network
    if (!url.pathname.startsWith('/k/')) return;
    // network first so a fresh profile is picked up; this artisan's last copy, then the plain
    // shell, as the offline fallback
    event.respondWith(
      fetch(req).then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(VERSION).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => caches.match(req).then(hit => hit || caches.match(SHELL_PAGE)))
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
