/* Service worker — SAMEM */
const CACHE = 'samem-v1';
const PRECACHE = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './assets/img/logo.jpeg',
  './assets/img/icon-192.png',
  './assets/img/icon-512.png',
  './assets/img/apple-touch-180.png',
  './assets/img/servicio-cctv.webp',
  './assets/img/servicio-alarma.webp',
  './assets/img/servicio-acceso.webp',
  './assets/img/servicio-portero.webp'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).catch(() => {}).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).then((resp) => { const c = resp.clone(); caches.open(CACHE).then((x) => x.put(request, c)); return resp; }).catch(() => caches.match('./index.html'))
    );
    return;
  }
  if (request.destination === 'style' || request.destination === 'script') {
    event.respondWith(
      fetch(request).then((resp) => { const c = resp.clone(); caches.open(CACHE).then((x) => x.put(request, c)); return resp; }).catch(() => caches.match(request))
    );
    return;
  }
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((resp) => { const c = resp.clone(); caches.open(CACHE).then((x) => x.put(request, c)); return resp; }).catch(() => cached))
  );
});
