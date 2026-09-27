import { getAll, getOne, createDoc, updateDocById, subscribeToCollection, where, orderBy } from '../firebase/firestore'

const COLLECTION = 'announcements'

/**
 * All Firestore access for the `announcements` collection goes through
 * this file, same pattern as companyService.js / driveService.js.
 */

/** Every announcement, unfiltered. Used by the admin table. */
export function getAllAnnouncements() {
  return getAll(COLLECTION, orderBy('publishedAt', 'desc'))
}

/** Only published announcements — what the public site is allowed to see.
 * "draft" never appears publicly, same rule Firestore Security Rules
 * enforce server-side. */
export function getPublishedAnnouncements() {
  return getAll(COLLECTION, where('status', '==', 'published'))
}

/** Live version of getPublishedAnnouncements — updates immediately when an
 * announcement is added, edited, or published/unpublished, with no page
 * reload needed. */
export function subscribeToPublishedAnnouncements(callback, onError) {
  return subscribeToCollection(COLLECTION, callback, onError, where('status', '==', 'published'))
}

export function getAnnouncementById(id) {
  return getOne(COLLECTION, id)
}

export function createAnnouncement(data) {
  return createDoc(COLLECTION, data)
}

export function updateAnnouncement(id, data) {
  return updateDocById(COLLECTION, id, data)
}

export function setAnnouncementStatus(id, status) {
  return updateDocById(COLLECTION, id, { status })
}
