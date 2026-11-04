// Service worker de Gym Manager: deja instalar la app y abrirla rápido.
// Solo guarda archivos propios de la app. Los datos (la API) siempre se piden a la red,
// para que nunca se vea una membresía, una rutina o una medida vieja.
const VERSION = 'gym-v1';
const SHELL = ['/', '/manifest.webmanifest', '/favicon.svg', '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(VERSION)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // API, fuentes y videos: siempre red

  // Pantallas: primero la red (así se ve la versión nueva); sin conexión, la última guardada.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copia = res.clone();
            caches.open(VERSION).then((c) => c.put('/', copia));
          }
          return res;
        })
        .catch(() => caches.match('/'))
    );
    return;
  }

  // Archivos de la app (llevan un código en el nombre, cambian con cada versión): primero lo guardado.
  if (url.pathname.startsWith('/assets/') || SHELL.includes(url.pathname)) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) {
              const copia = res.clone();
              caches.open(VERSION).then((c) => c.put(req, copia));
            }
            return res;
          })
      )
    );
  }
});
