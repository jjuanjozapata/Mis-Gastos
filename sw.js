const CACHE_VERSION = 'v19-staff';
const CACHE_NAME = `gastos-${CACHE_VERSION}`;
const ASSETS = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                if (key !== CACHE_NAME) {
                    return caches.delete(key);
                }
            })
        )).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    if (!url.origin.includes(self.location.origin) || url.protocol === 'chrome-extension:') {
        return;
    }

    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    const resToCache = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, resToCache));
                    return response;
                })
                .catch(() => caches.match('/index.html') || new Response('Offline', { status: 503 }))
        );
        return;
    }

    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                fetch(event.request).then(networkResponse => {
                    if (networkResponse && networkResponse.status === 200) {
                        caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse));
                    }
                }).catch(() => {});
                return cachedResponse;
            }
            return fetch(event.request).then(networkResponse => {
                if (!networkResponse || networkResponse.status !== 200) {
                    return networkResponse;
                }
                const resToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, resToCache));
                return networkResponse;
            }).catch(() => new Response('', { status: 408, statusText: 'Network request failed' }));
        })
    );
});