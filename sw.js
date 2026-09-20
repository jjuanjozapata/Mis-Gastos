const CACHE_NAME = 'gastos-v6'; 
const ASSETS = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                if (key !== CACHE_NAME) return caches.delete(key);
            })
        )).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    // Ignora llamadas a la base de datos
    if (event.request.url.includes('supabase.co')) return;

    // ESTRATEGIA NETWORK-FIRST PARA EL HTML: Destruye el bug de caché
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => caches.match('/index.html'))
        );
        return;
    }

    // CACHE-FIRST para los demás assets (íconos, manifest)
    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request))
    );
});