const CACHE_NAME = 'meetwoyou-v1';
const assetsToCache = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/meetwoyou.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/sweetalert2@11'
];

// ক্যাশ মেমরিতে ফাইল সেভ করা
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(assetsToCache);
    })
  );
});

// পুরনো ক্যাশ ডিলিট করা
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)));
    })
  );
});

// নেটওয়ার্ক ফার্স্ট স্ট্রেটেজি (ইন্টারনেট থাকলে নতুন ডেটা নিবে, না থাকলে ক্যাশ থেকে দেখাবে)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // নতুন ডেটা ক্যাশে আপডেট করে রাখা
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
      .catch(() => {
        // ইন্টারনেট না থাকলে ক্যাশ থেকে ফাইল দিবে
        return caches.match(event.request);
      })
  );
});
