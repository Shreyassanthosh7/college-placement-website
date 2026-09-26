import { getOne, upsertDocById, subscribeToDoc } from '../firebase/firestore'

const COLLECTION = 'settings'
const DOC_ID = 'general'

/**
 * Site-wide configurable settings (spec section 27) — a single document at
 * settings/general, not a whole collection, since there's only ever one of
 * these. getSettings() returns null if it's never been saved yet (e.g.
 * brand-new project before any admin has visited Settings) — callers
 * should fall back to sensible defaults in that case, not treat it as an
 * error.
 */

export function getSettings() {
  return getOne(COLLECTION, DOC_ID)
}

export function updateSettings(data) {
  return upsertDocById(COLLECTION, DOC_ID, data)
}

/** Live version of getSettings() — fires immediately with the current
 * settings, then again every time an admin saves a change, with no page
 * reload needed on the public site. Also returns `null` if the document
 * doesn't exist yet, same as getSettings(). */
export function subscribeToSettings(callback, onError) {
  return subscribeToDoc(COLLECTION, DOC_ID, callback, onError)
}
