// sw.js — Service Worker for Pattiboard
// VERSION is embedded in index.html and checked on every load.
// When index.html changes (new deploy), the SW re-installs and clears old cache.
const CACHE = 'pattiboard-202603160624';

const STATIC = [
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './favicon.ico',
  './favicon-32.png',
  './favicon-16.png',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;900&family=Lato:wght@300;400;700&display=swap'
];

// Install: cache static assets (NOT index.html — we always fetch that fresh)
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(STATIC))
      .then(() => self.skipWaiting())
  );
});

// Activate: wipe every old cache version immediately
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Fetch strategy:
//   index.html  → network-first (always try to get latest, fall back to cache)
//   everything else → cache-first (fast, offline-safe)
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  const isHTML = url.pathname.endsWith('/') || url.pathname.endsWith('.html');

  if (isHTML) {
    // Network-first: fresh HTML on every load so new deploys are picked up
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(cache => cache.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
  } else {
    // Cache-first: static assets served instantly
    e.respondWith(
      caches.match(e.request)
        .then(cached => cached || fetch(e.request)
          .then(res => {
            const clone = res.clone();
            caches.open(CACHE).then(cache => cache.put(e.request, clone));
            return res;
          })
        )
    );
  }
});

// Listen for SKIP_WAITING message from the page
self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING') self.skipWaiting();
});
