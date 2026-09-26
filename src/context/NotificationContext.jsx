import { useEffect, useRef, useState } from 'react'
import { NotificationContext } from './notification-context'
import { subscribeToVisibleCompanies } from '../services/companyService'
import { subscribeToUpcomingDrives } from '../services/driveService'
import { subscribeToPublishedAnnouncements } from '../services/announcementService'

const CATEGORIES = ['companies', 'drives', 'announcements']
const storageKey = (category) => `placementCell:lastSeen:${category}`

/**
 * Single source of truth for the public site's "site content" (companies,
 * drives, announcements) AND "what's new" state, tracked separately per
 * category rather than one global flag.
 *
 * Uses Firestore's real-time `onSnapshot` listeners (via
 * subscribeToVisibleCompanies/subscribeToUpcomingDrives/
 * subscribeToPublishedAnnouncements), not one-time reads — when an admin
 * publishes something while a visitor has the site open, it appears here
 * immediately, with no page reload. That's the whole point of this being a
 * subscription instead of a fetch.
 *
 * Each category clears its own badge the moment the visitor actually
 * visits that section — Companies.jsx, Drives.jsx, and Announcements.jsx
 * each call `markCategorySeen(category)` on mount. That's deliberate: the
 * badge should go away from spontaneously browsing to the content, not
 * from a separate "mark as read" action like opening a bell dropdown. The
 * bell itself is read-only — it shows what's still unseen and links to it,
 * but doesn't clear anything by being opened.
 *
 * "Seen" uses a plain localStorage timestamp per category on the visitor's
 * own browser — there are no student accounts (spec section 3), so
 * there's nothing server-side to track this against. This is a real,
 * standalone web app running in the visitor's actual browser once
 * deployed, not a sandboxed preview environment.
 */
export function NotificationProvider({ children }) {
  const [companies, setCompanies] = useState([])
  const [drives, setDrives] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // lastSeen affects what gets rendered (newCounts below), so it's state,
  // not a ref — reading a ref's .current during render is a real
  // anti-pattern (a value read this way can go stale without triggering a
  // re-render). fetchTimeRef is fine as a ref: it's only read inside the
  // markCategorySeen() event handler, never during render.
  const [lastSeen, setLastSeen] = useState({ companies: null, drives: null, announcements: null })
  const fetchTimeRef = useRef(null)

  useEffect(() => {
    const initialLastSeen = {}
    for (const category of CATEGORIES) {
      try {
        const stored = window.localStorage.getItem(storageKey(category))
        initialLastSeen[category] = stored ? Number(stored) : null
      } catch {
        initialLastSeen[category] = null
      }
    }
    setLastSeen(initialLastSeen)
    fetchTimeRef.current = Date.now()

    // Track which of the three listeners have delivered at least one
    // snapshot yet, so `loading` only clears once all three are ready —
    // onSnapshot's first callback fires asynchronously (from Firestore's
    // local cache or the server), same shape as the old Promise.all did.
    const ready = { companies: false, drives: false, announcements: false }
    function checkAllReady() {
      if (ready.companies && ready.drives && ready.announcements) setLoading(false)
    }
    function handleError() {
      // A real Firestore error (e.g. permission-denied if rules aren't
      // published) reported through onSnapshot's error callback, not a
      // rejected promise — this is what actually catches that case now,
      // not a guess based on a timeout.
      setError('Unable to load placement opportunities right now.')
      setLoading(false)
    }

    const unsubCompanies = subscribeToVisibleCompanies((data) => {
      setCompanies(data)
      ready.companies = true
      checkAllReady()
    }, handleError)
    const unsubDrives = subscribeToUpcomingDrives((data) => {
      setDrives(data)
      ready.drives = true
      checkAllReady()
    }, handleError)
    const unsubAnnouncements = subscribeToPublishedAnnouncements((data) => {
      setAnnouncements(data)
      ready.announcements = true
      checkAllReady()
    }, handleError)

    return () => {
      unsubCompanies()
      unsubDrives()
      unsubAnnouncements()
    }
  }, [])

  function countNew(items, category) {
    const baseline = lastSeen[category]
    // Never-visited-this-category-before: nothing counts as new — there's
    // no prior visit to compare against, and flagging an entire fresh
    // dataset as "new" would be meaningless noise for a first-time visitor.
    if (!baseline) return 0
    return items.filter((item) => item.createdAt?.toMillis && item.createdAt.toMillis() > baseline).length
  }

  const newCounts = {
    companies: countNew(companies, 'companies'),
    drives: countNew(drives, 'drives'),
    announcements: countNew(announcements, 'announcements'),
  }

  const hasNew = !loading && (newCounts.companies > 0 || newCounts.drives > 0 || newCounts.announcements > 0)

  /**
   * Called by Companies.jsx / Drives.jsx / Announcements.jsx when each
   * mounts — i.e. the moment the visitor actually looks at that section.
   * Uses the fetch-time snapshot rather than Date.now() at visit time: a
   * student could leave a tab open for a while before navigating over,
   * and a later timestamp would risk missing something that arrived in
   * the meantime.
   */
  function markCategorySeen(category) {
    const timestamp = fetchTimeRef.current ?? Date.now()
    try {
      window.localStorage.setItem(storageKey(category), String(timestamp))
    } catch {
      // If storage is unavailable, the badge just won't persist across
      // visits — not worth failing anything else over.
    }
    setLastSeen((prev) => ({ ...prev, [category]: timestamp }))
  }

  const value = { companies, drives, announcements, loading, error, newCounts, hasNew, markCategorySeen }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}
