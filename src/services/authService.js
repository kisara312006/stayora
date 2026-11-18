import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { auth, db, googleProvider, isFirebaseConfigured } from '../config/firebase'

// Always show the Google account chooser, which helps when testing several accounts.
googleProvider.setCustomParameters({ prompt: 'select_account' })

function assertConfigured() {
  if (!isFirebaseConfigured) {
    throw new Error('Firebase is not configured. Check your .env file.')
  }
}

// Profile names must be 2 to 80 characters (Security Rules), so Google
// accounts without a usable name get a safe fallback.
function fallbackName(user) {
  const name = (user.displayName || user.email?.split('@')[0] || '').trim()
  return name.length >= 2 ? name.slice(0, 80) : 'Stayora user'
}

// Creates users/{uid}. The Security Rules only allow exactly these fields and
// these starting values (points 0, level 1, not suspended, not verified).
export async function createUserProfile(user, { displayName, role, phone }) {
  assertConfigured()
  await setDoc(doc(db, 'users', user.uid), {
    displayName: displayName.trim(),
    email: user.email,
    phone: phone?.trim() || null,
    role,
    preferredLocations: [],
    budgetMin: null,
    budgetMax: null,
    preferredType: '',
    points: 0,
    level: 1,
    suspended: false,
    ownerVerificationStatus: 'none',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function registerWithEmail({ displayName, email, password, role, phone }) {
  assertConfigured()
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password)
  const user = credential.user

  // If saving the profile fails, the account still exists. We report that so
  // the person can finish setting up instead of being stuck.
  let profileCreated = true
  try {
    await createUserProfile(user, { displayName, role, phone })
  } catch (error) {
    console.error('Account created, but the profile could not be saved:', error.code)
    profileCreated = false
  }

  try {
    await sendEmailVerification(user)
  } catch (error) {
    console.error('Could not send the verification email:', error.code)
  }

  return { user, profileCreated }
}

export async function loginWithEmail(email, password) {
  assertConfigured()
  await signInWithEmailAndPassword(auth, email.trim(), password)
}

// With a role (Register page): a brand-new Google user gets a profile straight away.
// Without a role (Login page): new users are sent to choose one first.
export async function signInWithGoogle({ role } = {}) {
  assertConfigured()
  const { user } = await signInWithPopup(auth, googleProvider)
  const snapshot = await getDoc(doc(db, 'users', user.uid))

  if (snapshot.exists()) return { user, needsProfile: false }
  if (!role) return { user, needsProfile: true }

  await createUserProfile(user, {
    displayName: fallbackName(user),
    role,
    phone: '',
  })
  return { user, needsProfile: false }
}

export async function requestPasswordReset(email) {
  assertConfigured()
  await sendPasswordResetEmail(auth, email.trim())
}

export async function resendVerificationEmail() {
  assertConfigured()
  if (!auth.currentUser) throw new Error('Not signed in.')
  await sendEmailVerification(auth.currentUser)
}

export async function logout() {
  assertConfigured()
  await signOut(auth)
}

// Only these fields may be changed from the browser (the rules enforce it too).
const editableFields = [
  'displayName',
  'phone',
  'preferredLocations',
  'budgetMin',
  'budgetMax',
  'preferredType',
]

export async function updateUserProfile(uid, changes) {
  assertConfigured()
  const safeChanges = {}
  for (const key of editableFields) {
    if (key in changes) safeChanges[key] = changes[key]
  }
  await updateDoc(doc(db, 'users', uid), {
    ...safeChanges,
    updatedAt: serverTimestamp(),
  })
}