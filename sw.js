const CACHE_NAME = 'jule-portfolio-v1';
const urlsToCache = [
  'https://juleskuy.netlify.app/',
  'https://juleskuy.netlify.app/index.html',
  'https://juleskuy.netlify.app/manifest.json',
  'https://juleskuy.netlify.app/assets/css/main.css',
  'https://juleskuy.netlify.app/assets/img/hero-bg.png',
  'https://juleskuy.netlify.app/assets/img/profile-img.jpg',
  'https://juleskuy.netlify.app/assets/img/favicon.png',
  'https://juleskuy.netlify.app/assets/img/apple-touch-icon.png',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css',
  'https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css',
  'https://cdn.jsdelivr.net/npm/glightbox@3.2.0/dist/css/glightbox.min.css'
];

// Install service worker and cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Fetch resources from cache first, then network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if found
        if (response) {
          return response;
        }

        // Clone the request because it can only be used once
        const fetchRequest = event.request.clone();

        // Make network request and cache the response
        return fetch(fetchRequest).then(response => {
          // Check if response is valid
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response because it can only be used once
          const responseToCache = response.clone();

          // Add response to cache
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
  );
});

// Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
