import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useAdminRecentCounts } from '../hooks/useAdminRecentCounts'
import logo from '../assets/logo.png'

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: GridIcon },
  { to: '/admin/companies', label: 'Companies', icon: BriefcaseIcon, badgeKey: 'companies' },
  { to: '/admin/drives', label: 'Placement Drives', icon: CalendarIcon, badgeKey: 'drives' },
  { to: '/admin/announcements', label: 'Announcements', icon: MegaphoneIcon, badgeKey: 'announcements' },
  { to: '/admin/settings', label: 'Settings', icon: GearIcon },
]

export default function AdminLayout() {
  const { profile, firebaseUser, signOut } = useAuth()
  const { counts: recentCounts } = useAdminRecentCounts()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen md:flex" style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Mobile-only top bar — the sidebar itself is hidden below md, so
          this is the only way to reach the nav/logout on a phone or a
          narrow tablet in portrait. Fixed so it stays reachable while
          scrolling a long admin page. */}
      <div
        className="md:hidden fixed top-0 inset-x-0 z-40 glass flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <img src={logo} alt="TNDALU seal" className="w-8 h-8 rounded-full object-contain shrink-0" />
          <span className="font-display font-semibold text-sm truncate">Placement Cell</span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open admin menu"
          aria-expanded={mobileOpen}
          className="p-2 rounded-md hover:bg-white/40"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Backdrop, mobile drawer mode only */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar — a normal in-flow column on desktop (md:static), a
          slide-in overlay drawer below that (fixed, translated off-screen
          until opened). Same content either way, just different
          positioning, so there's only one nav to keep in sync. */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 shrink-0 glass border-r flex flex-col
          transition-transform duration-300 md:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="flex items-center justify-between gap-3 px-5 py-5">
          <div className="flex items-center gap-3 min-w-0">
            <img src={logo} alt="TNDALU seal" className="w-9 h-9 rounded-full object-contain shrink-0" />
            <div className="min-w-0">
              <p className="font-display font-semibold text-sm leading-tight truncate">Placement Cell</p>
              <p className="text-xs text-muted-foreground leading-tight">Admin Dashboard</p>
            </div>
          </div>
          {/* Close button, mobile drawer mode only */}
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close admin menu"
            className="md:hidden p-1.5 rounded-md hover:bg-white/40 shrink-0"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto" aria-label="Admin">
          {NAV_ITEMS.map(({ to, label, icon: Icon, badgeKey }) => {
            const badgeCount = badgeKey ? recentCounts[badgeKey] : 0
            return (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive ? '' : 'text-foreground/80 hover:bg-white/5'
                  }`
                }
                style={({ isActive }) =>
                  isActive
                    ? { backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-foreground)' }
                    : undefined
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="flex-1">{label}</span>
                    {badgeCount > 0 && (
                      <span
                        className="min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold flex items-center justify-center"
                        style={
                          isActive
                            ? { backgroundColor: 'rgba(255,255,255,0.25)', color: 'var(--color-primary-foreground)' }
                            : { backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-foreground)' }
                        }
                        title="Added in the last 48 hours"
                      >
                        {badgeCount > 9 ? '9+' : badgeCount}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>

        <div className="px-5 py-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <p className="text-xs text-muted-foreground truncate">{profile?.name || firebaseUser?.email}</p>
          <p className="text-xs mb-3" style={{ color: 'var(--color-primary)' }}>Administrator</p>
          <button
            type="button"
            onClick={signOut}
            className="btn-outline-gold w-full rounded-full text-xs font-semibold py-2"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Content — top padding on mobile clears the fixed top bar; back
          to the normal padding on desktop where there's no top bar. */}
      <main className="flex-1 min-w-0 p-6 pt-20 sm:p-8 md:pt-8">
        <Outlet />
      </main>
    </div>
  )
}

function GridIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}
function BriefcaseIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeLinecap="round" />
    </svg>
  )
}
function CalendarIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" /><path d="M8 3v4M16 3v4M3 10h18" strokeLinecap="round" />
    </svg>
  )
}
function MegaphoneIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <path d="M3 11v2a2 2 0 0 0 2 2h1l3 5V4l-3 5H5a2 2 0 0 0-2 2Z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 8a4 4 0 0 1 0 8M18 5a8 8 0 0 1 0 14" strokeLinecap="round" />
    </svg>
  )
}
function GearIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </svg>
  )
}
