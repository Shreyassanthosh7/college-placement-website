import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNotifications } from '../hooks/useNotifications'

/**
 * Persistent bell + numeric badge in the navbar, always visible on every
 * public page — not just Home. Purely read-only: opening it does NOT
 * clear anything. A badge only clears when the visitor actually visits
 * the corresponding section (Companies/Drives/Announcements each call
 * markCategorySeen on mount — see NotificationContext.jsx). That was a
 * deliberate change from an earlier version where opening the bell itself
 * marked everything seen — the whole point of this feature is for the
 * badge to reflect content the visitor has actually looked at, not
 * content they've merely glanced at a dropdown listing.
 */
export default function NotificationBell() {
  const { newCounts, hasNew, loading } = useNotifications()
  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)

  const total = newCounts.companies + newCounts.drives + newCounts.announcements

  useEffect(() => {
    if (!open) return
    function onClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false)
    }
    function onKeyDown(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  if (loading) return null

  const items = [
    newCounts.companies > 0 && { to: '/companies', label: 'New placement opportunities', count: newCounts.companies },
    newCounts.drives > 0 && { to: '/drives', label: 'New drives scheduled', count: newCounts.drives },
    newCounts.announcements > 0 && { to: '/announcements', label: 'New announcements', count: newCounts.announcements },
  ].filter(Boolean)

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={hasNew ? `Notifications, ${total} new` : 'Notifications'}
        aria-expanded={open}
        className="relative p-2 rounded-full hover:bg-white/5 transition-colors duration-200 cursor-pointer"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {hasNew && (
          <span
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-foreground)' }}
          >
            {total > 9 ? '9+' : total}
          </span>
        )}
      </button>

      {open && (
        <div className="glass rounded-xl p-3 absolute right-0 mt-2 w-72 max-w-[calc(100vw-2rem)] z-50 shadow-lg">
          <p className="font-display text-sm font-bold px-2 pb-2">Notifications</p>
          {items.length === 0 ? (
            <p className="text-xs text-muted-foreground px-2 pb-2">Nothing new right now — check back later.</p>
          ) : (
            <ul className="space-y-1">
              {items.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between gap-2 text-sm rounded-lg px-2 py-2 transition-colors duration-200 hover:bg-white/5"
                  >
                    <span>{item.label}</span>
                    <span
                      className="text-xs font-bold rounded-full px-2 py-0.5"
                      style={{ backgroundColor: 'var(--color-muted)', color: 'var(--color-primary)' }}
                    >
                      {item.count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
