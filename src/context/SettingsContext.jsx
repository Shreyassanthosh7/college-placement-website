import { useEffect, useState } from 'react'
import { SettingsContext } from './settings-context'
import { subscribeToSettings } from '../services/settingsService'
import { mockSettings } from '../data/mockData'

/**
 * Site-wide settings (spec section 27), subscribed to once for every
 * public page via context rather than each page (Navbar, Footer, About,
 * Contact, Home) independently querying `settings/general`.
 *
 * Uses Firestore's real-time `onSnapshot` listener (via
 * subscribeToSettings), not a one-time read — when an admin saves changes
 * in AdminSettings.jsx while a visitor already has the site open, the
 * navbar, footer, About, Contact, and Home's mission blurb all update
 * immediately, with no page reload needed. This mirrors the same
 * real-time pattern already used for companies/drives/announcements (see
 * NotificationContext.jsx).
 *
 * `settings` is always a fully-populated object — real saved values are
 * merged on top of `mockSettings` as defaults, field by field (including
 * the nested `social` object), so:
 *   - Before any admin has ever saved Settings, the site shows the same
 *     real TNDALU info it always has — not a broken, empty page.
 *   - After a partial save (e.g. an admin only updates the phone number),
 *     everything else still falls back sensibly instead of disappearing.
 */
export function SettingsProvider({ children }) {
  const [saved, setSaved] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToSettings(
      (doc) => {
        setSaved(doc)
        setLoading(false)
      },
      () => {
        // Fall back to mockSettings defaults below — not worth an error
        // banner site-wide just because Settings couldn't load; the rest
        // of the site should still work.
        setLoading(false)
      }
    )
    return unsubscribe
  }, [])

  const settings = {
    ...mockSettings,
    ...saved,
    social: { ...mockSettings.social, ...(saved?.social || {}) },
  }

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  )
}
