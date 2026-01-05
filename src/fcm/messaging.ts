/* eslint-disable @typescript-eslint/no-explicit-any */
import { deleteToken, getToken /*, onMessage */ } from "firebase/messaging";
import { getMessagingInstance } from "./config";

// VAPID key from firebase console
const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY as string;

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, any>;
}

// Get SW registration, ensuring only one instance
const getServiceWorkerRegistration = async () => {
  // Check for existing registration first
  const existingReg = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js');
  if (existingReg) {
    console.log('Found existing SW registration');
    return existingReg;
  }
  
  // Register new if none exists
  console.log('Registering new SW');
  return navigator.serviceWorker.register('/firebase-messaging-sw.js', {
    scope: '/'
  });
};


// Clear any stale token
export const clearExistingToken = async (): Promise<void> => {
  try {
    const messaging = await getMessagingInstance();
    if (!messaging) return;
    
    try {
      await deleteToken(messaging);
      console.log('Existing token deleted');
    } catch {
      console.log('No token to delete');
    }
  } catch (error) {
    console.error('Error clearing token:', error);
  }
};

// Step 1: request permission and get FCM token
export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    // 1. Check browser support
    if (!("Notification" in window)) {
      console.log("Browser does not support notifications");
      return null;
    }

    // 2. Get permission
    console.log("Requesting notification permission...");
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }
    console.log("Notification permission granted");

    // 3. Get Firebase messaging instance
    const messaging = await getMessagingInstance();
    if (!messaging) {
      console.log("Firebase messaging not supported");
      return null;
    }

    // 4. Get service worker registration - crucial for FCM V1
    console.log("Getting service worker registration...");
    const registration = await getServiceWorkerRegistration();
    
    // Wait for SW to be activated
    if (registration.installing || registration.waiting) {
      console.log("Waiting for service worker to be active...");
      await new Promise<void>((resolve) => {
        const serviceWorker = registration.installing || registration.waiting;
        if (!serviceWorker) {
          resolve();
          return;
        }
        
        serviceWorker.addEventListener('statechange', (e) => {
          if ((e.target as ServiceWorker).state === 'activated') {
            console.log("Service worker now activated");
            resolve();
          }
        });
      });
    }
    
    // 5. Log VAPID key info (for debugging)
    console.log("VAPID key present:", !!VAPID_KEY, "length:", VAPID_KEY?.length);
    if (!VAPID_KEY) {
      console.error("VAPID key is missing or empty");
      return null;
    }

    // 6. Try to get existing subscription first (debug)
    try {
      const existingSub = await registration.pushManager.getSubscription();
      if (existingSub) {
        console.log("Found existing push subscription, will be replaced");
      }
    } catch (e) {
      console.warn("Error checking existing subscription:", e);
    }

    // 7. Get FCM token
    console.log("Getting FCM token...");
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration
    });

    console.log("FCM Token acquired successfully");
    return token;
  } catch (err: any) {
    // Enhanced error logging
    console.error("getToken failed raw:", err);
    
    // Log network errors separately
    if (err?.code === 'messaging/failed-service-worker-registration') {
      console.error("Service worker registration failed for messaging");
    } else if (err?.code === 'messaging/permission-blocked') {
      console.error("Notification permission blocked by browser");
    } else if (err?.code === 'messaging/unsupported-browser') {
      console.error("Browser doesn't support FCM");
    } else if (err?.code === 'messaging/token-subscribe-failed') {
      console.error("Failed to subscribe to FCM");
    }
    
    if (err?.stack) console.error(err.stack);
    return null;
  }
};
