const CACHE_NAME = 'boiler-supabase-cache-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Pag-install ng asset caches sa background storage ng phone shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Paglilinis ng mga luma o expired cache files
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Network First, Cache Fallback System Engine
self.addEventListener('fetch', (event) => {
  // Huwag i-cache ang mga cloud request patungong Supabase REST endpoint para laging fresh data ang makuha
  if (event.request.url.includes('supabase.co')) {
    return; 
  }

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
