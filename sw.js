const CACHE_NAME = 'meetwoyou-v2'; // ভার্সন আপডেট করা হয়েছে
const assetsToCache = [
  '/',
  '/index.html',
  '/dashboard.html',
  '/meetwoyou.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/sweetalert2@11'
];

// ১. ইনস্টলেশন: প্রয়োজনীয় ফাইলগুলো ক্যাশ করা
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching essential assets...');
      return cache.addAll(assetsToCache);
    })
  );
  self.skipWaiting(); // নতুন সার্ভিস ওয়ার্কারকে সাথে সাথে একটিভ করবে
});

// ২. এক্টিভেশন: পুরনো ক্যাশ ক্লিয়ার করা
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim(); // সব ট্যাবকে সাথে সাথে কন্ট্রোল করবে
});

// ৩. ফেচ স্ট্রেটেজি: নেটওয়ার্ক থেকে এনে ক্যাশে রাখা (ছবি ও পোস্টের জন্য সেরা)
self.addEventListener('fetch', (event) => {
  // শুধুমাত্র GET রিকোয়েস্ট ক্যাশ করবে (Firebase বা POST রিকোয়েস্ট বাদ দিয়ে)
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // যদি রেসপন্স ঠিক থাকে, তবে তা ক্যাশে সেভ/আপডেট করা
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        // নেটওয়ার্ক ফেইল করলে (অফলাইন থাকলে) ক্যাশ থেকে ফাইল দিবে
        return caches.match(event.request);
      });

      // যদি ক্যাশে ফাইল থাকে তবে ক্যাশ থেকে দেখাবে (খুব দ্রুত), 
      // আর ব্যাকগ্রাউন্ডে নেটওয়ার্ক থেকে ফাইল আপডেট হতে থাকবে।
      return cachedResponse || fetchPromise;
    })
  );
});
