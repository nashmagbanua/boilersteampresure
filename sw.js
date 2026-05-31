const CACHE_NAME = 'abn-steam-v6.0';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './abnlogo.png',
  './icon-192.png',
  './icon-512.png',
  './og-preview.png'
];

// Install Phase - I-cache lahat ng core files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate Phase - Linisin ang mga lumang cache blocks para makapasok ang bago
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Clearing deprecated asset cache storage...');
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch Phase - Network First strategy para sa live telemetry, Fallback to Cache offline
self.addEventListener('fetch', (event) => {
  // Hayaan ang mga panlabas na API requests gaya ng Supabase na dumaan diretso sa live network
  if (event.request.url.includes('supabase.co') || event.request.url.includes('rest/v1')) {
    return;
  }
  
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});

// Makinig sa mensahe mula sa main page para laktawan ang paghihintay at mag-update agad
self.addEventListener('message', (event) => {
  if (event.data && event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
