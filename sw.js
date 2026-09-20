<<<<<<< HEAD
const CACHE_NAME = 'gastos-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/manifest.json'
];

// Instalar y cachear interfaz estática
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
    );
});

// Interceptar peticiones. Si no hay red, sirve desde caché.
self.addEventListener('fetch', event => {
    // Excluir llamadas directas a la API de Supabase del caché estático
    if (event.request.url.includes('supabase.co')) return;

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
=======
const CACHE_NAME = 'gastos-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/manifest.json'
];

// Instalar y cachear interfaz estática
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
    );
});

// Interceptar peticiones. Si no hay red, sirve desde caché.
self.addEventListener('fetch', event => {
    // Excluir llamadas directas a la API de Supabase del caché estático
    if (event.request.url.includes('supabase.co')) return;

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
>>>>>>> b7a68939e1607bcb04d066d0f5db9ca699f9cec3
});