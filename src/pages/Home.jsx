import { useState } from 'react'
import { Link } from 'react-router-dom'
import CompanyCard from '../components/CompanyCard'
import EmptyState from '../components/EmptyState'
import Reveal from '../components/Reveal'
import AuroraBackground from '../components/AuroraBackground'
import CountUp from '../components/CountUp'
import NewContentToast from '../components/NewContentToast'
import { useNotifications } from '../hooks/useNotifications'
import { useSettings } from '../hooks/useSettings'

export default function Home() {
  const { companies, drives, loading, error, newCounts, hasNew } = useNotifications()
  const { settings } = useSettings()
  const [toastHidden, setToastHidden] = useState(false)

  // Public visibility rule (mirrors what Firestore Security Rules will
  // enforce in Phase 10): only "active" and "upcoming" companies preview
  // here. "draft" never reaches this list (getVisibleCompanies excludes it
  // at the query level, already applied in NotificationContext); "closed"
  // moves to Previous Drives.
  const publicCompanies = companies.filter((c) => c.status === 'active' || c.status === 'upcoming')
  const activeCompanies = companies.filter((c) => c.status === 'active')

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <AuroraBackground />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center">
          <Reveal>
            <span
              className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase px-3 py-1.5 rounded-full glass mb-6"
              style={{ color: 'var(--color-primary)' }}
            >
              School of Excellence in Law &middot; TNDALU
            </span>
            <h1 className="font-display text-4xl sm:text-6xl font-bold tracking-tight max-w-3xl mx-auto leading-[1.1]">
              Empowering Careers Through{' '}
              <span className="text-shimmer">Campus Placements</span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
              The Placement Cell connects students with verified internship and job
              opportunities, coordinates campus recruitment drives, and keeps every
              batch informed — all in one place.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/companies"
                className="glow-on-hover px-7 py-3.5 rounded-full font-semibold transition-transform duration-200 hover:-translate-y-0.5 cursor-pointer"
                style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-foreground)' }}
              >
                View Opportunities
              </Link>
              <Link
                to="/drives"
                className="glass glow-on-hover px-7 py-3.5 rounded-full font-semibold transition-transform duration-200 hover:-translate-y-0.5 cursor-pointer"
              >
                Upcoming Drives
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Stats — computed from live Firestore data, not invented numbers.
          "Students Placed" has no honest source yet (no placements
          collection exists), so it stays an empty dash rather than a guess. */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-6 -mt-4 relative z-10">
        <Reveal stagger className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Companies', value: loading ? '' : companies.length },
            { label: 'Active Opportunities', value: loading ? '' : activeCompanies.length },
            { label: 'Upcoming Drives', value: loading ? '' : drives.length },
            { label: 'Students Placed', value: '—' },
          ].map((stat) => (
            <div key={stat.label} className="glass glow-on-hover rounded-xl p-5 text-center">
              <p className="font-display text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>
                {loading ? <span className="opacity-40">···</span> : <CountUp value={stat.value} />}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* Active opportunities */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <Reveal className="flex items-center justify-between mb-5">
          <h2 className="font-display text-2xl font-bold">Active Placement Opportunities</h2>
          <Link to="/companies" className="text-sm font-semibold hover:underline" style={{ color: 'var(--color-primary)' }}>
            View all →
          </Link>
        </Reveal>
        {loading ? (
          <p className="text-muted-foreground text-sm">Loading opportunities…</p>
        ) : error ? (
          <EmptyState title={error} />
        ) : publicCompanies.length === 0 ? (
          <EmptyState
            title="No active placement opportunities are currently available."
            description="Please check again later."
          />
        ) : (
          <Reveal stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {publicCompanies.slice(0, 3).map((c) => (
              <CompanyCard key={c.id} company={c} />
            ))}
          </Reveal>
        )}
      </section>

      {/* Mission blurb, grounded in the real SOEL/SIIC description */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        <Reveal>
          <div className="glass glow-on-hover rounded-xl p-8 relative overflow-hidden">
            <div
              className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-40"
              style={{ background: 'var(--color-primary)' }}
              aria-hidden="true"
            />
            <h2 className="font-display text-xl font-bold mb-2 relative">About the Placement Cell</h2>
            <p className="text-muted-foreground relative">{settings.aboutText}</p>
            <Link to="/about" className="inline-block mt-4 text-sm font-semibold hover:underline relative" style={{ color: 'var(--color-primary)' }}>
              Read more about us →
            </Link>
          </div>
        </Reveal>
      </section>

      {/* "What's new since your last visit" popup. Dismissing this (auto or
          manual) only hides this component locally — it does NOT clear the
          persistent bell badge in the navbar (see NotificationBell.jsx),
          which is the actual fix for "even if students miss the popup". */}
      {hasNew && !toastHidden && (
        <NewContentToast counts={newCounts} onDismiss={() => setToastHidden(true)} />
      )}
    </div>
  )
}
