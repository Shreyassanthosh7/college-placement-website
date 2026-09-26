import { useEffect, useState } from 'react'
import { subscribeToAuthChanges, signIn as firebaseSignIn, signOut as firebaseSignOut } from '../firebase/auth'
import { getOne } from '../firebase/firestore'
import { AuthContext } from './auth-context'

/**
 * Authentication alone is not authorization (per the project brief, section
 * 12/29): a signed-in Firebase user is only treated as an admin if their
 * users/{uid} Firestore document exists AND has role === "ADMIN". This
 * mirrors the Firestore Security Rules from Phase 10 — the UI check here is
 * a convenience for routing/rendering, not the real security boundary. The
 * real boundary is server-side rules, which check the exact same field.
 */
export function AuthProvider({ children }) {
  const [firebaseUser, setFirebaseUser] = useState(null)
  const [profile, setProfile] = useState(null) // users/{uid} doc: { name, email, role }
  const [status, setStatus] = useState('loading') // 'loading' | 'signed-out' | 'signed-in'
  const [error, setError] = useState(null)

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (user) => {
      setError(null)
      if (!user) {
        setFirebaseUser(null)
        setProfile(null)
        setStatus('signed-out')
        return
      }

      setFirebaseUser(user)
      try {
        const userDoc = await getOne('users', user.uid)
        setProfile(userDoc)
      } catch (err) {
        // A failed profile lookup should not silently grant access — treat
        // it the same as "no profile", which isAdmin below treats as
        // unauthorized.
        //
        // The detailed diagnostic (which Firestore error, and what it
        // usually means) goes to the browser console, not the on-screen
        // message — this screen is reachable by anyone who's signed in
        // but not an approved admin, and Firestore paths/rules internals
        // aren't something to show them. Whoever is actually debugging
        // this (the site owner) has DevTools open anyway.
        setProfile(null)
        if (err.code === 'permission-denied') {
          console.error(
            '[AuthContext] Firestore denied reading users/{uid} (permission-denied). ' +
              'Have you published firestore.rules in Firebase Console → Firestore Database → Rules → Publish?',
            err
          )
        } else {
          console.error('[AuthContext] Failed to load admin profile.', err)
        }
        setError('Unable to verify admin access. Please contact the site administrator.')
      }
      setStatus('signed-in')
    })
    return unsubscribe
  }, [])

  const isAdmin = status === 'signed-in' && profile?.role === 'ADMIN'

  async function signIn(email, password) {
    setError(null)
    try {
      await firebaseSignIn(email, password)
      // onAuthStateChanged above will pick up the resulting user and
      // fetch their profile — nothing else to do here.
    } catch (err) {
      // Map Firebase's error codes to messages a non-technical admin can
      // act on, per the brief's "do not expose technical Firebase errors"
      // rule. Deliberately vague between wrong-email and wrong-password so
      // failed logins don't reveal which admin emails exist.
      const friendlyMessages = {
        'auth/invalid-credential': 'Incorrect email or password.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/user-disabled': 'This account has been disabled. Contact the site owner.',
        'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
        'auth/network-request-failed': 'Network error. Check your connection and try again.',
      }
      const message = friendlyMessages[err.code] || 'Unable to sign in. Please try again.'
      setError(message)
      throw new Error(message)
    }
  }

  async function signOut() {
    await firebaseSignOut()
  }

  const value = {
    firebaseUser,
    profile,
    isAdmin,
    status, // 'loading' | 'signed-out' | 'signed-in'
    error,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
