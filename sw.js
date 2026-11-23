/* Rumbo al PPER: funciona sin conexión.
   La app se pide primero a la red (así llegan las actualizaciones) y, si no hay red, sale de la caché.
   Las fuentes de Google se guardan la primera vez que se descargan. */
const CACHE = 'rumbo-pper-v3';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon.svg', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function fromCache(request) {
  return caches.match(request, { ignoreSearch: true })
    .then(hit => hit || (request.mode === 'navigate' ? caches.match('./index.html') : undefined));
}

function networkFirst(request) {
  return new Promise(resolve => {
    let done = false;
    const finish = res => { if (!done && res) { done = true; resolve(res); } };
    // con mala cobertura, a los 4 s se sirve la copia guardada si la hay
    const timer = setTimeout(() => fromCache(request).then(finish), 4000);
    fetch(request)
      .then(res => {
        clearTimeout(timer);
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(cache => cache.put(request, copy));
        }
        finish(res);
      })
      .catch(() => {
        clearTimeout(timer);
        fromCache(request).then(hit => finish(hit || Response.error()));
      });
  });
}

function cacheFirst(request) {
  return caches.match(request).then(hit => hit || fetch(request).then(res => {
    if (res && (res.ok || res.type === 'opaque')) {
      const copy = res.clone();
      caches.open(CACHE).then(cache => cache.put(request, copy));
    }
    return res;
  }));
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin === self.location.origin) event.respondWith(networkFirst(request));
  else if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com' || (url.hostname === 'cdn.jsdelivr.net' && url.pathname.includes('@supabase/supabase-js@'))) event.respondWith(cacheFirst(request));
});
