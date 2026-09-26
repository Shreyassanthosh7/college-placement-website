import { useEffect, useState } from 'react'
import { getAllCompanies } from '../services/companyService'
import { getAllDrives } from '../services/driveService'
import { getAllAnnouncements } from '../services/announcementService'

const RECENT_WINDOW_MS = 48 * 60 * 60 * 1000 // 48 hours

/**
 * Powers the small numeric badges on the admin sidebar (Companies, Placement
 * Drives, Announcements) — an "app-style" notification count of items added
 * recently, at a glance from any admin page, not just the Dashboard.
 *
 * Deliberately NOT a per-admin "since your last visit" system like the
 * public NotificationContext: there's no admin session/visit tracking
 * infrastructure, and multiple admins may share awareness of the same
 * content. A plain rolling "added in the last 48 hours" window is simpler,
 * honest about what it means (labeled as such wherever it's shown), and
 * doesn't require guessing at per-admin state that doesn't exist yet.
 */
export function useAdminRecentCounts() {
  const [counts, setCounts] = useState({ companies: 0, drives: 0, announcements: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const cutoff = Date.now() - RECENT_WINDOW_MS

    const isRecent = (item) => item.createdAt?.toMillis && item.createdAt.toMillis() > cutoff

    Promise.all([getAllCompanies(), getAllDrives(), getAllAnnouncements()])
      .then(([companies, drives, announcements]) => {
        if (cancelled) return
        setCounts({
          companies: companies.filter(isRecent).length,
          drives: drives.filter(isRecent).length,
          announcements: announcements.filter(isRecent).length,
        })
      })
      .catch(() => {
        // Badges just silently stay at 0 on failure — this is a nice-to-have
        // indicator, not something worth showing an error banner for on
        // every single admin page.
      })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [])

  return { counts, loading }
}
