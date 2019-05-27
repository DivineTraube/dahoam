const CACHE_NAME = 'resources-v1';

self.addEventListener('fetch', function(event) {
    if (event.request.method === 'GET') {
        event.respondWith(execFetch(event.request));
    }
});

async function execFetch(request) {
    return networkCacheFallback(request);
}

/**
 * Implements `Network, Cache Fallback` strategy (offline mode)
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
