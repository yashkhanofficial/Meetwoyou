const CACHE_NAME = 'meetwoyou-v4'; // ভার্সন আপডেট করা হয়েছে
const assetsToCache = [
  '/',
  '/index.html',
  '/dashboard.html',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/sweetalert2@11'
];

// --- INSTALL EVENT ---
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching Assets');
      return cache.addAll(assetsToCache);
    })
  );
  self.skipWaiting();
});

// --- ACTIVATE EVENT ---
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Service Worker: Clearing Old Cache', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// --- FETCH EVENT ---
self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // ১. Firebase, Google APIs, Cloudinary বা Firestore রিকোয়েস্ট ক্যাশ করা যাবে না
  if (
    url.includes('firebase') || 
    url.includes('firestore') || 
    url.includes('googleapis') || 
    url.includes('cloudinary') ||
    event.request.method !== 'GET' // শুধুমাত্র GET রিকোয়েস্ট ক্যাশ হবে
  ) {
    return; // সরাসরি নেটওয়ার্ক থেকে ডেটা নিবে
  }

  // ২. Stale-while-revalidate স্ট্র্যাটেজি
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // যদি নেটওয়ার্ক রেসপন্স সঠিক হয়, তবে ক্যাশ আপডেট করো
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        // অফলাইন থাকলে এবং ক্যাশে না থাকলে fallback দিতে পারেন
        return caches.match(event.request);
      });

      return cachedResponse || fetchPromise;
    })
  );
});
