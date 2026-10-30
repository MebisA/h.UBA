const CACHE = 'huba-patricia-2026-v6';
const APP_FILES = ['./', './index.html', './styles.css', './styles-v6.css', './app.js', './manifest.webmanifest', './assets/icon-192.png', './assets/icon-512.png', './assets/robot.png', './assets/robot-original.png', './materiales/icp1-programa.pdf', './materiales/icp1-organizador.pdf', './materiales/icp2-programa-2026.pdf', './materiales/icp2-cronograma-2026.pdf', './materiales/ipc-programa-2025.pdf', './materiales/ipc-organizador-2025.pdf', './materiales/icse-programa-2024.pdf', './materiales/icse-organizador-2024.pdf'];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(APP_FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== self.location.origin) return;
  e.respondWith(fetch(e.request).then(response => {
    if (response.ok) { const copy = response.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return response;
  }).catch(() => caches.match(e.request).then(r => r || (e.request.mode === 'navigate' ? caches.match('./index.html') : Response.error()))));
});
