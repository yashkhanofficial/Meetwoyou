importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

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
  console.log('[firebase-messaging-sw.js] Background message received ', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  const data = event.notification.data;
  let url = "/dashboard.html";

  if (data?.chatId) {
    url = `/dashboard.html?chat=${data.chatId}`;
  } else if (data?.postId) {
    url = `/dashboard.html?post=${data.postId}`;
  }

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes("dashboard.html") && 'focus' in client) {
          client.postMessage(data);
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});
