import { useEffect, useState } from 'react'
import { SettingsContext } from './settings-context'
import { subscribeToSettings } from '../services/settingsService'

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
 * The public site uses only saved settings. Empty values stay empty until an
 * administrator fills them in, and the social object is always available to
 * consumers that read individual links.
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
        setLoading(false)
      }
    )
    return unsubscribe
  }, [])

  const settings = {
    ...(saved || {}),
    social: { ...(saved?.social || {}) },
  }

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  )
}
