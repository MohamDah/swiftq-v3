// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/11.9.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.9.1/firebase-messaging-compat.js');

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyAgHGWoN_SEbQMH3wa7eZp8NfKQWdVXQaI",
  authDomain: "foundations-swiftq.firebaseapp.com",
  projectId: "foundations-swiftq",
  storageBucket: "foundations-swiftq.firebasestorage.app",
  messagingSenderId: "1011952216751",
  appId: "1:1011952216751:web:123894d316950d1489c25a",
  measurementId: "G-94XWJ2EMZQ"
});

const messaging = firebase.messaging();

// This function runs when a notification arrives and the app is closed/hidden
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);
  
  // Extract notification data
  const notificationTitle = payload.data.title || 'SwiftQ Notification';
  const notificationOptions = {
    body: payload.data.body || 'You have a new notification from SwiftQ',
    icon: '/swiftqIcon.png',
    badge: '/raysGreen.png',
    tag: 'swiftq-queue-notification', // Prevents multiple notifications stacking
    data: payload.data, // Custom data we can use later
    actions: [ // These create buttons on the notification
      {
        action: 'view',
        title: 'View Queue'
      },
      {
        action: 'dismiss', 
        title: 'Dismiss'
      }
    ],
    renotify: true,
    // requireInteraction: true // Notification stays until user acts
  };

  // Show the notification
  self.registration.showNotification(notificationTitle, notificationOptions);
  // prevent default
  return true
});

// Handle when user clicks on the notification
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  // Close the notification
  event.notification.close();
  
  // Handle different actions
  if (event.action === 'view' || event.action !== "dismiss") {
    // Get the queue info from the notification data
    const queueId = event.notification.data?.queueId;
    const customerId = event.notification.data?.customerId;
    const queueCode = event.notification.data?.queueCode;
    
    if (queueId && customerId) {
      // Open the queue page
      const url = `https://swiftq-v2.netlify.app/queue/${queueCode}/customer/${customerId}`;
      event.waitUntil(clients.openWindow(url));
    }
  }
  // If action is 'dismiss' or no action, just close (already done above)
});