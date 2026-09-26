/**
 * Format an ISO date string ("2026-09-15") as a readable date.
 * Returns an empty string for missing/invalid input rather than throwing,
 * since this runs directly on Firestore-shaped data that may have gaps.
 */
export function formatDate(isoDate, options) {
  if (!isoDate) return ''
  const date = new Date(`${isoDate}T00:00:00`)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
  })
}

/** Returns true if the ISO date is today or in the future. */
export function isUpcoming(isoDate) {
  if (!isoDate) return false
  const date = new Date(`${isoDate}T23:59:59`)
  return date.getTime() >= Date.now()
}

/**
 * Format a Firestore Timestamp (e.g. a document's `createdAt`) the same
 * way formatDate() formats a plain ISO date string — used wherever a raw
 * Timestamp needs to match the rest of the site's date styling instead of
 * being left unformatted or not shown at all.
 */
export function formatTimestamp(timestamp, options) {
  if (!timestamp?.toDate) return ''
  return timestamp.toDate().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
  })
}

/**
 * Format a 24-hour "HH:MM" time string (the raw value an <input type="time">
 * stores, e.g. "14:00") as a friendly 12-hour time (e.g. "2:00 PM"). Every
 * other date/time value on the site goes through formatDate()'s polished
 * "15 Sep 2026" style — drive times were the one place still showing a raw
 * 24-hour string, which read as a data leak next to everything else.
 */
export function formatTime(time24) {
  if (!time24) return ''
  const [hoursStr, minutesStr] = time24.split(':')
  const hours = Number(hoursStr)
  const minutes = Number(minutesStr)
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return time24
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  return date.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })
}
