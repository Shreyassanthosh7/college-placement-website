import { getAll, getOne, createDoc, updateDocById, subscribeToCollection, where, orderBy } from '../firebase/firestore'

const COLLECTION = 'companies'

/**
 * All Firestore access for the `companies` collection goes through this
 * file. Pages never import from `src/firebase/firestore.js` directly for
 * company data — this keeps the query shape (which statuses count as
 * "public", sort order, etc.) defined in exactly one place.
 */

/** Every company, unfiltered. Used by the admin table. */
export function getAllCompanies() {
  return getAll(COLLECTION, orderBy('createdAt', 'desc'))
}

/** Every status the public site is allowed to see — active, upcoming, and
 * closed (closed listings still show up, just under Previous Drives).
 * "draft" is never included here; only getAllCompanies() (admin-only) sees
 * drafts. Public pages should always call this, never getAllCompanies(). */
export function getVisibleCompanies() {
  return getAll(COLLECTION, where('status', 'in', ['active', 'upcoming', 'closed']))
}

/** Live version of getVisibleCompanies — fires the callback immediately
 * with the current data, then again every time a company is added, edited,
 * or its status changes, with no page reload needed. Returns the
 * unsubscribe function; callers MUST call it in a useEffect cleanup. */
export function subscribeToVisibleCompanies(callback, onError) {
  return subscribeToCollection(COLLECTION, callback, onError, where('status', 'in', ['active', 'upcoming', 'closed']))
}

/** Only companies visible to the public site: active or upcoming.
 * "draft" never appears publicly; "closed" moves to Previous Drives instead
 * of disappearing (see getClosedCompanies). */
export function getPublicCompanies() {
  return getAll(COLLECTION, where('status', 'in', ['active', 'upcoming']))
}

/** Closed companies — shown on the Previous Drives page. */
export function getClosedCompanies() {
  return getAll(COLLECTION, where('status', '==', 'closed'))
}

export function getCompanyById(id) {
  return getOne(COLLECTION, id)
}

export function createCompany(data) {
  return createDoc(COLLECTION, data)
}

export function updateCompany(id, data) {
  return updateDocById(COLLECTION, id, data)
}

export function setCompanyStatus(id, status) {
  return updateDocById(COLLECTION, id, { status })
}
