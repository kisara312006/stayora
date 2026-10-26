import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Values come from your .env file. Vite only exposes names starting with VITE_.
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// A value counts as "missing" if it is empty or still the placeholder
// text copied from .env.example.
export const missingFirebaseKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value || value.startsWith('your-'))
  .map(([name]) => name)

export const isFirebaseConfigured = missingFirebaseKeys.length === 0

if (!isFirebaseConfigured) {
  console.error(
    'Firebase is not configured. Missing or placeholder values:',
    missingFirebaseKeys,
  )
}

// Only start Firebase when the config is real, so the app shows a clear
// message instead of crashing.
const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null

export const auth = app ? getAuth(app) : null
export const db = app ? getFirestore(app) : null
export const storage = app ? getStorage(app) : null
export const googleProvider = new GoogleAuthProvider()