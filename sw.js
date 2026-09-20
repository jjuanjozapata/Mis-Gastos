const CACHE_NAME = 'gastos-v3'; // <--- Esto obliga al iPhone a actualizarse
const ASSETS = [
    '/',
    '/index.html',
    '/manifest.json'
];

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) return caches.delete(key);
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    if (event.request.url.includes('supabase.co')) return;
    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request))
    );
});