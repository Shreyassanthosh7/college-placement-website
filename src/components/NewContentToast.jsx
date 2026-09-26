import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const AUTO_DISMISS_MS = 14000

/**
 * Popup toast, bottom-right, listing counts of new companies/drives/
 * announcements since the visitor's last visit (see NotificationContext).
 * Auto-dismisses after a while but can be closed manually; respects
 * prefers-reduced-motion by skipping the slide-in transition.
 *
 * Important: `onDismiss` here only hides this toast component — it does
 * NOT mark the notifications as "seen" globally. That's deliberate: the
 * whole point of the persistent bell in the navbar is to survive exactly
 * this toast disappearing (on its own, or by an accidental close) without
 * the visitor ever actually reading it. Only opening the bell clears the
 * badge (see NotificationBell.jsx).
 */
export default function NewContentToast({ counts, onDismiss }) {
  const [closing, setClosing] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => handleDismiss(), AUTO_DISMISS_MS)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleDismiss() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      onDismiss()
      return
    }
    setClosing(true)
    setTimeout(onDismiss, 250)
  }

  const items = [
    counts.companies > 0 && {
      to: '/companies',
      label: `${counts.companies} new placement ${counts.companies === 1 ? 'opportunity' : 'opportunities'}`,
    },
    counts.drives > 0 && {
      to: '/drives',
      label: `${counts.drives} new ${counts.drives === 1 ? 'drive' : 'drives'} scheduled`,
    },
    counts.announcements > 0 && {
      to: '/announcements',
      label: `${counts.announcements} new ${counts.announcements === 1 ? 'announcement' : 'announcements'}`,
    },
  ].filter(Boolean)

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-5 right-5 z-50 w-full max-w-sm transition-all duration-300 ${
        closing ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="glass rounded-2xl p-5 shadow-lg" style={{ borderColor: 'var(--color-primary)' }}>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: 'var(--color-primary)' }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: 'var(--color-primary)' }} />
            </span>
            <h2 className="font-display text-sm font-bold">What's new since your last visit</h2>
          </div>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss"
            className="text-muted-foreground hover:text-foreground leading-none text-lg -mt-1"
          >
            ×
          </button>
        </div>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                onClick={handleDismiss}
                className="flex items-center justify-between gap-2 text-sm rounded-lg px-3 py-2 transition-colors duration-200 hover:bg-white/5"
              >
                <span>{item.label}</span>
                <span style={{ color: 'var(--color-primary)' }}>→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
