const CACHE_NAME = 'resources-v1';
const staticAssets = [
    '/img/logo.png',
    '/css/styles.css',
    '/js/script.js',
    '/css/bootstrap.css',
];
const staticDestinations = [
    'image',
    'font',
    'style',
    'script',
];

self.addEventListener('install', function(event) {
    event.waitUntil(install());
});

self.addEventListener('fetch', function(event) {
    if (event.request.method === 'GET') {
        event.respondWith(execFetch(event.request));
    }
});

async function install() {
    caches.open(CACHE_NAME)
        .then(cache => cache.addAll(staticAssets))
}

async function execFetch(request) {
    const isStatic = staticAssets
        .some(asset => request.url.includes(asset));

    if (isStatic) {
        return cacheNetworkFallback(request);
    }

    if (staticDestinations.includes(request.destination)) {
        return cacheNetworkFallback(request);
    }

    if (request.url.includes('recommendation') ||
        request.url.includes('Cart')) {

        return networkOnly(request);
    }

    return networkCacheFallback(request);
}

/**
 * Implements `cache, network fallback` strategy
 */
async function networkOnly(request) {
    return await fetch(request);
}

/**
 * Implements `cache only` strategy
 */
async function cacheOnly(request) {
    return caches.match(request);
}

/**
 * Implements `cache only` strategy
 */
async function cacheNetworkFallback(request) {
    const response = await cacheOnly(request);
    return response || networkCacheFallback(request);
}

/**
 * Implements `network, cache fallback` strategy (offline mode)
 */
async function networkCacheFallback(request) {
    if (!navigator.onLine) {
        // Respond from cache when offline
        return caches.match(request);
    }

    try {
        const response = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());

        return response;
    } catch {
        // Respond from cache on error
        return caches.match(request);
    }
}
