importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCJi4JVE1CV6uqmMDiN8sIUMD6unMwJA_E",
  authDomain: "swiftq-v3.firebaseapp.com",
  projectId: "swiftq-v3",
  storageBucket: "swiftq-v3.firebasestorage.app",
  messagingSenderId: "351384299898",
  appId: "1:351384299898:web:016f82b33b278479788ec3"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message:', payload);
  
  const notificationTitle = payload.data?.title || 'SwiftQ Notification';
  const notificationOptions = {
    body: payload.data?.body || "It's your turn!",
    icon: '/swiftqIcon.png',
    badge: '/raysGreen.png',
    tag: 'swiftq-queue-notification',
    data: payload.data,
    actions: [
      {
        action: 'view',
        title: 'View Queue'
      },
      {
        action: 'dismiss', 
        title: 'Dismiss'
      }
    ],
    requireInteraction: true,
    renotify: true,
    vibrate: [200, 100, 200]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
  
  return true;
});

self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'view' || event.action !== "dismiss") {
    const qrCode = event.notification.data?.qrCode;
    
    if (qrCode) {
      const url = `${self.location.origin}/queue/${qrCode}/customer`;
      event.waitUntil(clients.openWindow(url));
    }
  }
});

self.addEventListener('notificationclose', (event) => {
  console.log('[firebase-messaging-sw.js] Notification was closed.', event);
});
