import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// All values come from .env (VITE_FIREBASE_*), never hardcoded here, so the
// same code works for any Firebase project without editing source files.
// These are the public Web App config values — safe to ship to the browser;
// they are not secrets. Real protection comes from Firestore Security
// Rules (Phase 10), not from hiding this config.
//
// Note: this app deliberately does NOT use Firebase Storage. Storage
// (needed for image uploads) requires the paid Blaze plan for the modern
// default bucket format — since this project stays on Firestore + Auth
// only, storageBucket isn't a required config value here, and no Storage
// SDK is imported anywhere in the codebase.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const REQUIRED_KEYS = ['apiKey', 'authDomain', 'projectId', 'appId']
const missingKeys = REQUIRED_KEYS.filter((key) => !firebaseConfig[key])

if (missingKeys.length > 0) {
  // Fail loudly and early rather than letting every Firestore/Auth call
  // throw a confusing error deep in some component later.
  throw new Error(
    `Missing Firebase config values: ${missingKeys.join(', ')}. ` +
      'Copy .env.example to .env and fill in your Firebase project\'s Web App config.'
  )
}

// getApp()/getApps() guard avoids a "duplicate app" error if Vite's dev
// server hot-reloads this module.
export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)

// Analytics is optional and was included because the project config has a
// measurementId. It's guarded with isSupported() because it can throw in
// environments without a browser `window` (e.g. some test runners) or where
// the browser blocks it (private browsing, ad blockers). Nothing else in
// the app depends on `analytics` being non-null.
export let analytics = null
if (import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) {
  import('firebase/analytics').then(({ getAnalytics, isSupported }) => {
    isSupported().then((supported) => {
      if (supported) analytics = getAnalytics(firebaseApp)
    })
  })
}
