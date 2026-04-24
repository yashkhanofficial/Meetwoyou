importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBn3x2qSo8k6a9wrxNfLmVliWMmsUk8wfY",
  authDomain: "meetwoyou-436a2.firebaseapp.com",
  projectId: "meetwoyou-436a2",
  storageBucket: "meetwoyou-436a2.firebasestorage.app",
  messagingSenderId: "612788132077",
  appId: "1:612788132077:web:0a8b92edf26778efd4d4e4"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image || '/logo.png',
    vibrate: [200, 100, 200],
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = self.location.origin + "/dashboard.html";
  event.waitUntil(
    clients.openWindow(urlToOpen)
  );
});
