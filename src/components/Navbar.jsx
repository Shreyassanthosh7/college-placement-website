import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../assets/logo.png'
import NotificationBell from './NotificationBell'
import { useSettings } from '../hooks/useSettings'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/companies', label: 'Companies' },
  { to: '/drives', label: 'Drives' },
  { to: '/announcements', label: 'Announcements' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { settings } = useSettings()

  const linkClass = ({ isActive }) =>
    `relative px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'text-primary'
        : 'text-foreground/80 hover:text-foreground'
    }`

  return (
    <header className="glass sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center gap-3 min-w-0">
            <span className="relative shrink-0">
              <span
                className="absolute inset-0 rounded-full blur-md opacity-60"
                style={{ background: 'var(--color-glow)' }}
                aria-hidden="true"
              />
              <img
                src={settings.logoUrl || logo}
                alt={`${settings.collegeName} seal`}
                className="relative w-11 h-11 rounded-full object-contain"
              />
            </span>
            <div className="min-w-0">
              <p className="font-display font-semibold leading-tight truncate">{settings.placementCellName}</p>
              <p className="text-xs text-muted-foreground leading-tight truncate">{settings.collegeName}</p>
            </div>
          </NavLink>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={linkClass} end={l.to === '/'}>
                {({ isActive }) => (
                  <>
                    {l.label}
                    <span
                      className="absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full transition-transform duration-300 origin-left"
                      style={{
                        background: 'var(--color-primary)',
                        transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
                      }}
                      aria-hidden="true"
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Bell is always visible (desktop + mobile) — it's the fix for
              "even if students miss the popup": the badge persists across
              every page, not just Home, until the bell is opened. */}
          <div className="flex items-center gap-1">
            <NotificationBell />

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-foreground hover:bg-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer"
              style={{ outlineColor: 'var(--color-ring)' }}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {open ? (
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile nav panel */}
        {open && (
          <nav id="mobile-nav" className="md:hidden pb-4 flex flex-col gap-1" aria-label="Primary mobile">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
