/* eslint-disable @typescript-eslint/no-explicit-any */
import { getToken, onMessage } from "firebase/messaging";
import { db, getMessagingInstance } from "./config";
import { doc, updateDoc } from "firebase/firestore";

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

// Step 1: request permission and get FCM token
export const requestNotificationPermission = async (): Promise<string | null> => {
  try {
    if (!("Notification" in window)) {
      console.log("Browser does not support notifications");
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    // Get Firebase messaging instance
    const messaging = await getMessagingInstance();
    if (!messaging) {
      console.log("Firebase messaging not supported");
      return null;
    }

    // Get unique token for this browser
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY
    });

    console.log("FCM Token: ", token);
    return token;
  } catch (error) {
    console.error("Error getting notification permission: ", error);
    return null;
  }
};

// Step 2: Store the token with the customer data
export const storeCustomerFCMToken = async (
  queueId: string,
  customerId: string,
  token: string
): Promise<void> => {
  try {
    // Update the customer document in Firestore with their FCM token
    const customerRef = doc(db, "queues", queueId, "customers", customerId);
    await updateDoc(customerRef, {
      fcmToken: token,
      notificationsEnabled: true,
      tokenUpdatedAt: (new Date()).toISOString()
    });
    console.log("FCM token stored successfully");
  } catch (error) {
    console.error("Error storing FCM token: ", error);
    throw error;
  }
};

// Step 3: Listen for notification when app is open
export const onForegroundMessage = (callback: (payload: any) => void) => {
  return getMessagingInstance().then(messaging => {
    if (!messaging) return () => { };

    return onMessage(messaging, (payload) => {
      console.log("Message received while app is open:", payload);
      callback(payload);
    });
  });
};

// Step 4: Show browser notification manually
export const showNotification = (payload: NotificationPayload): void => {
  if ("Notification" in window && Notification.permission === "granted") {
    const notification = new Notification(payload.title, {
      body: payload.body,
      icon: payload.icon || "/swiftqIcon.png",
      badge: payload.badge || "/swiftqIcon.png",
      tag: payload.tag || "swiftq-notification",
      data: payload.data,
      requireInteraction: true
    });

    notification.onclick = () => {
      window.focus();
      notification.close();

      if (payload.data?.queueId && payload.data?.customerId) {
        window.location.href = `/queue/${payload.data.queueId}/customer/${payload.data.customerId}`
      }
    };
  }
};