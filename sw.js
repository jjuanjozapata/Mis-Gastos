const CACHE_NAME = 'gastos-v12-sec'; 
const ASSETS = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', event => {
    self.skipWaiting(); // Fuerza la instalación inmediata, destruyendo versiones viejas
    event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.map(key => {
                if (key !== CACHE_NAME) return caches.delete(key);
            })
        )).then(() => self.clients.claim()) // Toma control de los clientes al instante
    );
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // 1. BYPASS ESTRICTO: Supabase y Extensiones (Cero intercepción)
    if (url.origin.includes('supabase.co') || url.protocol === 'chrome-extension:') return;

    // 2. ESTRATEGIA NETWORK-FIRST (Para navegación base y Atajos iOS)
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    const resToCache = response.clone(); // Clon síncrono blindado
                    // Delegamos la escritura al background para no bloquear el hilo
                    event.waitUntil(
                        caches.open(CACHE_NAME).then(cache => cache.put(event.request, resToCache))
                    );
                    return response;
                })
                .catch(() => caches.match(event.request).then(res => res || caches.match('/index.html')))
        );
        return;
    }

    // 3. ESTRATEGIA STALE-WHILE-REVALIDATE (Para assets estáticos y librerías)
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            const fetchPromise = fetch(event.request).then(networkResponse => {
                // Filtramos opacos (status 0) y errores de red
                if (!networkResponse || networkResponse.status !== 200) {
                    return networkResponse;
                }
                
                const resToCache = networkResponse.clone();
                event.waitUntil(
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, resToCache))
                );
                
                return networkResponse;
            }).catch(() => null); // Evita romper la app si falla la red
            
            return cachedResponse || fetchPromise;
        })
    );
});