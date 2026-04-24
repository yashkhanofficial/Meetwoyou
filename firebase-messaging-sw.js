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

// Handle Background Messages
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.data.icon || '/logo.png', // Replace with your app logo
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle Notification Clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const targetUrl = '/dashboard.html'; // Adjust if your file structure is different

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
