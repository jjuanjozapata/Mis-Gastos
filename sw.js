const CACHE_NAME = 'gastos-v10-sec'; 
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
    const url = new URL(event.request.url);
    
    // Bypass estricto para Supabase (Garantiza ejecución RLS real-time)
    if (url.origin.includes('supabase.co')) return;

    // Estrategia Network-First con retención de Query Params para Atajos iOS
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    const resClone = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
                    return response;
                })
                .catch(() => caches.match(event.request).then(res => res || caches.match('/index.html')))
        );
        return;
    }

    // Stale-While-Revalidate para Assets (Tailwind, CDN, ChartJS)
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            const fetchPromise = fetch(event.request).then(networkResponse => {
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse.clone()));
                return networkResponse;
            }).catch(() => null);
            return cachedResponse || fetchPromise;
        })
    );
});