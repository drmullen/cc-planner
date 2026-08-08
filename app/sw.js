/*
 * CC Planner Pro Service Worker
 * Version 2.1.0 (revision 2026-08-08)
 * Mind to Motion Studios, LLC
 *
 * Strategy:
 *  - Navigations: network-first, falling back to the cached app shell when offline.
 *    This keeps users on current code whenever they have a connection.
 *  - Same-origin static assets: stale-while-revalidate.
 *  - Versioned cache names. Bumping APP_VERSION invalidates all previous caches
 *    on activate, so users are never stuck on stale code.
 *  - No background sync or push handlers. Those features are not implemented in
 *    the app, so the service worker does not pretend to support them.
 */

const APP_VERSION = '2.1.0';
const CACHE_PREFIX = 'ccp-';
const STATIC_CACHE = `${CACHE_PREFIX}static-v${APP_VERSION}`;

const STATIC_FILES = [
  './',
  './index.html',
  './manifest.json',
  './sw.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_FILES))
      .catch(() => { /* offline install attempt; shell will cache on first fetch */ })
  );
  // Do NOT skipWaiting automatically. The app shows an "update ready" prompt
  // and asks the user before activating new code mid-session.
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => Promise.all(
      names
        .filter((name) =>
          (name.startsWith(CACHE_PREFIX) || name.startsWith('cc-planner-')) &&
          name !== STATIC_CACHE)
        .map((name) => caches.delete(name))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;
  if (!request.url.startsWith(self.location.origin)) return;

  // Never cache blob:/data: or file-download style requests.
  const url = new URL(request.url);
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return;

  // Navigations: network-first so updates propagate, cached shell as offline fallback.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put('./index.html', copy));
          }
          return response;
        })
        .catch(() =>
          caches.match('./index.html').then((cached) =>
            cached || new Response(
              '<!doctype html><meta charset="utf-8"><title>Offline</title>' +
              '<body style="font-family:system-ui;background:#0a1214;color:#e9efee;display:grid;place-items:center;height:100vh;margin:0">' +
              '<div style="text-align:center;max-width:26rem;padding:1rem"><h1 style="font-size:1.2rem">You are offline</h1>' +
              '<p>CC Planner has not been cached on this device yet. Connect once to load the app; after that it works offline.</p></div>',
              { status: 503, headers: { 'Content-Type': 'text/html' } }
            )
          )
        )
    );
    return;
  }

  // Static assets: stale-while-revalidate.
  event.respondWith(
    caches.match(request).then((cached) => {
      const network = fetch(request)
        .then((response) => {
          if (response && response.ok && response.type === 'basic') {
            const copy = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});

self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys()
        .then((names) => Promise.all(names.map((name) => caches.delete(name))))
        .then(() => {
          if (event.ports && event.ports[0]) {
            event.ports[0].postMessage({ cleared: true });
          }
        })
    );
  }

  if (event.data.type === 'GET_VERSION') {
    if (event.ports && event.ports[0]) {
      event.ports[0].postMessage({ version: APP_VERSION });
    }
  }
});
