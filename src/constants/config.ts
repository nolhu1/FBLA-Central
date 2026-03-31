export const APP_NAME = "FBLA Central";

export const DEMO_MODE =
  process.env.EXPO_PUBLIC_APP_MODE?.toLowerCase() !== "production";

export const APP_MODE_LABEL = DEMO_MODE ? "Demo" : "Production";

export const FIREBASE_CONFIG = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

export const HAS_FIREBASE_CONFIG = Object.values(FIREBASE_CONFIG).every(Boolean);

export const STORAGE_KEYS = {
  session: "fbla-central/session",
  demoState: "fbla-central/demo-state"
} as const;
