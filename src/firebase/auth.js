import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from './config'

/**
 * Sign in an admin with email/password.
 * Throws Firebase's error object on failure — calling code (Phase 4's
 * AdminLogin) is responsible for mapping error.code to a friendly message
 * rather than showing raw Firebase errors to the user.
 */
export function signIn(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
}

export function signOut() {
  return firebaseSignOut(auth)
}

/**
 * Subscribe to auth state changes. Returns the unsubscribe function —
 * callers (AuthContext, Phase 4) should call this in a useEffect cleanup.
 */
export function subscribeToAuthChanges(callback) {
  return onAuthStateChanged(auth, callback)
}
