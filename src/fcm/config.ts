// src/firebase/config.ts
import { initializeApp } from "firebase/app";
import { getMessaging, isSupported, type Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

export const app = initializeApp(firebaseConfig);

export const getMessagingInstance = async (): Promise<Messaging | null> => {
  if (typeof window === "undefined") return null

  try {
    const supported = await isSupported()
    if (supported)
      return getMessaging(app)
    else
      throw new Error("Not Supported!")
  } catch (error) {
    console.warn("Firbase messaging not supported:", error)
    return null
  }
}
