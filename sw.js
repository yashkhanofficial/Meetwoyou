const CACHE_NAME = 'meetwoyou-v3'; // ভার্সন পরিবর্তন করা হয়েছে ক্যাশ ক্লিয়ার করার জন্য
const assetsToCache = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/meetwoyou.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/sweetalert2@11'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(assetsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // গুরুত্বপূর্ণ: Firebase, Cloudinary বা Firestore-এর রিকোয়েস্ট ক্যাশ করা যাবে না
  if (url.includes('firebase') || url.includes('firestore') || url.includes('googleapis') || url.includes('cloudinary')) {
    return; // সরাসরি ইন্টারনেট থেকে নিবে
  }

  // শুধুমাত্র GET রিকোয়েস্টের জন্য ক্যাশ চেক করবে
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return networkResponse;
        }).catch(() => caches.match(event.request));

        return cachedResponse || fetchPromise;
      })
    );
  }
});
// ADDED: Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker Installed');
});

self.addEventListener('fetch', event => {
  // basic fetch handling
});
