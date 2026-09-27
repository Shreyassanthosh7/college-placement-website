import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  setDoc,
  onSnapshot,
  serverTimestamp,
  query as firestoreQuery,
} from 'firebase/firestore'
import { db } from './config'

/**
 * Generic Firestore helpers, kept collection-agnostic so each file in
 * src/services/ (companyService.js, driveService.js, etc. — Phase 5+) stays
 * a thin, readable wrapper instead of repeating this boilerplate.
 *
 * These intentionally do NOT catch errors — callers decide how to surface
 * failures (see the project brief's error-handling rules: "Unable to load
 * companies.", "Unable to save company.", etc., not raw Firebase errors).
 */

export function getCollectionRef(collectionName) {
  return collection(db, collectionName)
}

export function getDocRef(collectionName, id) {
  return doc(db, collectionName, id)
}

/** Fetch every document in a collection, optionally filtered/ordered via Firestore query constraints. */
export async function getAll(collectionName, ...queryConstraints) {
  const q = firestoreQuery(getCollectionRef(collectionName), ...queryConstraints)
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
}

/** Fetch a single document by id. Returns null if it doesn't exist (not an error). */
export async function getOne(collectionName, id) {
  const snapshot = await getDoc(getDocRef(collectionName, id))
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null
}

/** Create a document, stamping createdAt/updatedAt automatically. */
export async function createDoc(collectionName, data) {
  const ref = await addDoc(getCollectionRef(collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

/** Update a document, stamping updatedAt automatically. */
export function updateDocById(collectionName, id, data) {
  return updateDoc(getDocRef(collectionName, id), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

/**
 * Create-or-update a document at a known id, merging fields rather than
 * overwriting the whole document. Used for singleton documents (e.g.
 * `settings/general`) that may not exist yet on first save — plain
 * updateDoc() throws if the document is missing, which setDoc(..., {merge:
 * true}) does not.
 */
export function upsertDocById(collectionName, id, data) {
  return setDoc(
    getDocRef(collectionName, id),
    { ...data, updatedAt: serverTimestamp() },
    { merge: true }
  )
}

/**
 * Subscribe to live updates on a collection. Returns the unsubscribe
 * function. Prefer getAll() for one-off reads (e.g. a page load) — reserve
 * this for views that should reflect changes without a refresh (the
 * public NotificationContext, admin list pages that want live updates).
 *
 * onError, if provided, receives Firestore's real error (e.g.
 * FirebaseError with .code 'permission-denied') — onSnapshot reports
 * failures through this second callback, not a rejected promise, so
 * callers that skip this parameter will otherwise fail silently (no data,
 * no error, stuck loading forever).
 */
export function subscribeToCollection(collectionName, callback, onError, ...queryConstraints) {
  const q = firestoreQuery(getCollectionRef(collectionName), ...queryConstraints)
  return onSnapshot(
    q,
    (snapshot) => callback(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))),
    onError
  )
}

/**
 * Subscribe to live updates on a single document (e.g. `settings/general`).
 * Returns the unsubscribe function. Same onError-callback shape as
 * subscribeToCollection, for the same reason: onSnapshot reports failures
 * through this second callback, not a rejected promise.
 *
 * Calls back with `null` if the document doesn't exist (e.g. before any
 * admin has saved Settings for the first time) — same "not an error"
 * convention as getOne().
 */
export function subscribeToDoc(collectionName, id, callback, onError) {
  return onSnapshot(
    getDocRef(collectionName, id),
    (snapshot) => callback(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null),
    onError
  )
}

// Re-export common query builders so services/*.js only ever import from
// this one file instead of also importing from 'firebase/firestore' directly.
export { where, orderBy, limit } from 'firebase/firestore'
