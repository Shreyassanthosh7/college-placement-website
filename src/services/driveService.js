import { getAll, getOne, createDoc, updateDocById, subscribeToCollection, where, orderBy } from '../firebase/firestore'

const COLLECTION = 'placementDrives'

/**
 * All Firestore access for the `placementDrives` collection goes through
 * this file, same pattern as companyService.js. Company name/role are
 * stored directly on the drive document (denormalized) rather than joined
 * live from `companies` on every read — the public Drives/PreviousDrives
 * pages would otherwise need one extra read per drive just to show a
 * name. The tradeoff (company renamed later won't retroactively update old
 * drive listings) is worth it for a collection that's read far more than
 * it's written.
 */

/** Every drive, unfiltered. Used by the admin table. */
export function getAllDrives() {
  return getAll(COLLECTION, orderBy('date', 'desc'))
}

/** Drives visible to the public site: upcoming or completed. "draft" never
 * appears publicly — same rule Firestore Security Rules enforce server-side. */
export function getVisibleDrives() {
  return getAll(COLLECTION, where('status', 'in', ['upcoming', 'completed']))
}

export function getUpcomingDrives() {
  return getAll(COLLECTION, where('status', '==', 'upcoming'))
}

/** Live version of getUpcomingDrives — updates immediately when a drive is
 * added, edited, or published/unpublished, with no page reload needed. */
export function subscribeToUpcomingDrives(callback, onError) {
  return subscribeToCollection(COLLECTION, callback, onError, where('status', '==', 'upcoming'))
}

export function getCompletedDrives() {
  return getAll(COLLECTION, where('status', '==', 'completed'))
}

export function getDriveById(id) {
  return getOne(COLLECTION, id)
}

export function createDrive(data) {
  return createDoc(COLLECTION, data)
}

export function updateDrive(id, data) {
  return updateDocById(COLLECTION, id, data)
}

export function setDriveStatus(id, status) {
  return updateDocById(COLLECTION, id, { status })
}
