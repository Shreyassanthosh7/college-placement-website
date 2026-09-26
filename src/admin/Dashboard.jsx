import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { getAllCompanies } from '../services/companyService'
import { getAllDrives } from '../services/driveService'
import { getAllAnnouncements } from '../services/announcementService'

export default function Dashboard() {
  const { profile, firebaseUser } = useAuth()
  const [companies, setCompanies] = useState(null) // null = still loading
  const [drives, setDrives] = useState(null)
  const [announcements, setAnnouncements] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([getAllCompanies(), getAllDrives(), getAllAnnouncements()])
      .then(([companyData, driveData, announcementData]) => {
        if (cancelled) return
        setCompanies(companyData)
        setDrives(driveData)
        setAnnouncements(announcementData)
      })
      .catch(() => { if (!cancelled) setError(true) })
    return () => { cancelled = true }
  }, [])

  // Companies, Drives, and Announcements: all live Firestore data.
  // Settings has no per-item stats of its own (it's a single config
  // document, not a list), so it's not in this list either.
  const stats = [
    { label: 'Total Companies', value: companies?.length },
    { label: 'Active Opportunities', value: companies?.filter((c) => c.status === 'active').length },
    { label: 'Upcoming Drives', value: drives?.filter((d) => d.status === 'upcoming').length },
    { label: 'Closed Drives', value: drives?.filter((d) => d.status === 'completed').length },
    { label: 'Announcements', value: announcements?.filter((a) => a.status === 'published').length },
  ]

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1">
        Welcome{profile?.name ? `, ${profile.name}` : ''}
      </h1>
      <p className="text-muted-foreground mb-6">{firebaseUser?.email}</p>

      {error && (
        <div role="alert" className="mb-6 rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: 'rgba(248,113,113,0.12)', color: 'var(--color-destructive)' }}>
          Unable to load dashboard statistics. Check that Firestore is set up and try refreshing.
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="glass glow-on-hover rounded-xl p-5">
            <p className="font-display text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>
              {s.value === undefined || s.value === null ? <span className="opacity-40">···</span> : s.value}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="glass rounded-xl p-6 mt-8">
        <h2 className="font-display text-lg font-bold mb-2">What's next</h2>
        <p className="text-sm text-muted-foreground">
          Company, Placement Drive, and Announcement management (add, edit, delete,
          publish/unpublish) are all fully live — try them from the sidebar. Settings covers
          site-wide info like contact details and the About/Footer text.
        </p>
      </div>
    </div>
  )
}
