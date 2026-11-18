// Turns Firebase error codes into messages a person can understand.
const messages = {
  'auth/email-already-in-use':
    'An account with this email already exists. Try logging in instead.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/weak-password': 'That password is too weak. Use at least 8 characters.',
  // Same message for "no such user" and "wrong password" so we never reveal
  // which emails have accounts.
  'auth/invalid-credential': 'Incorrect email or password.',
  'auth/user-not-found': 'Incorrect email or password.',
  'auth/wrong-password': 'Incorrect email or password.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/too-many-requests':
    'Too many attempts. Please wait a few minutes and try again.',
  'auth/network-request-failed':
    'Network problem. Check your internet connection and try again.',
  'auth/popup-blocked':
    'Your browser blocked the sign-in pop-up. Allow pop-ups for this site and try again.',
  'auth/operation-not-allowed':
    'This sign-in method is not enabled yet. Enable it in the Firebase console.',
  'auth/unauthorized-domain':
    'This address is not authorised for sign-in. Open the site at http://localhost:5173.',
  'permission-denied':
    'Your account was created, but saving your profile was refused. Please log in again.',
}

export function getAuthErrorMessage(error) {
  return messages[error?.code] ?? 'Something went wrong. Please try again.'
}

// Closing the Google pop-up is not an error worth showing.
export function isSilentAuthError(error) {
  return (
    error?.code === 'auth/popup-closed-by-user' ||
    error?.code === 'auth/cancelled-popup-request'
  )
}