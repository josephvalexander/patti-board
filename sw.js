// sw.js — Service Worker for കട്ടനും റമ്മിയും
const CACHE = 'pattiboard-20260827045728';
const VERSION = '20260827045728';

const STATIC = [
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './favicon.ico',
  './favicon-32.png',
  './favicon-16.png',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;900&family=Lato:wght@300;400;700&family=Noto+Sans+Malayalam:wght@400;700;900&display=swap'
];

// Install: pre-cache static assets and activate immediately
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(STATIC))
      .then(() => self.skipWaiting())
  );
});

// Activate: clear old caches and claim all clients
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
      .then(() => {
        // Tell all open pages the new version is active
        return self.clients.matchAll({includeUncontrolled: true})
          .then(clients => clients.forEach(c =>
            c.postMessage({type:'SW_ACTIVATED', version:VERSION})
          ));
      })
  );
});

// ── Version check helper ─────────────────────────────────────────────────────
// Fetches version.json from network (never cached) and compares to this SW's VERSION.
// If they differ, tells the page to re-register the SW — works even on old SWs
// because version.json is always fetched fresh (no-store).
async function checkVersionAndNotify() {
  try {
    const res = await fetch('./version.json', {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache, no-store' }
    });
    if (!res.ok) return;
    const data = await res.json();
    if (data.version !== VERSION) {
      // This SW is outdated — tell all clients to force-refresh
      const clients = await self.clients.matchAll({includeUncontrolled: true});
      clients.forEach(c => c.postMessage({type:'FORCE_UPDATE', latestVersion: data.version}));
    }
  } catch (e) {
    // Network unavailable — skip silently
  }
}

// Fetch strategy
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  const path = url.pathname;

  // Never cache sw.js or version.json
  if (path.endsWith('sw.js') || path.endsWith('version.json')) {
    e.respondWith(fetch(e.request, {cache: 'no-store'}));
    return;
  }

  const isHTML = path.endsWith('/') || path.endsWith('.html') || path === '/';

  if (isHTML) {
    // Network-first for HTML, then check version in background
    e.respondWith(
      fetch(e.request, {cache: 'no-cache'})
        .then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then(cache => cache.put(e.request, clone));
            // After serving fresh HTML, check if our version is still current
            checkVersionAndNotify();
          }
          return res;
        })
        .catch(() => {
          // Offline — serve from cache, still try version check
          checkVersionAndNotify();
          return caches.match(e.request);
        })
    );
  } else {
    // Cache-first for static assets
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then(cache => cache.put(e.request, clone));
          }
          return res;
        });
      })
    );
  }
});

// Handle messages from page
self.addEventListener('message', e => {
  if (e.data === 'SKIP_WAITING' || e.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});