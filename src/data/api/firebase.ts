import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions/dist/esm/index.esm.js";

import { FIREBASE_CONFIG, HAS_FIREBASE_CONFIG } from "@/constants/config";

export const getFirebaseServices = () => {
  if (!HAS_FIREBASE_CONFIG) {
    throw new Error("Firebase configuration is missing. Set EXPO_PUBLIC_FIREBASE_* values.");
  }

  const app = getApps().length ? getApp() : initializeApp(FIREBASE_CONFIG);

  return {
    app,
    auth: getAuth(app),
    db: getFirestore(app),
    functions: getFunctions(app)
  };
};
