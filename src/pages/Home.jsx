import { useState } from 'react'
import { Link } from 'react-router-dom'
import AnnouncementCard from '../components/AnnouncementCard'
import CompanyCard from '../components/CompanyCard'
import CountUp from '../components/CountUp'
import DriveCard from '../components/DriveCard'
import EmptyState from '../components/EmptyState'
import NewContentToast from '../components/NewContentToast'
import AnimatedTabs from '../components/ui/AnimatedTabs'
import MagneticButton from '../components/ui/MagneticButton'
import SpotlightCard from '../components/ui/SpotlightCard'
import { useNotifications } from '../hooks/useNotifications'
import { useSettings } from '../hooks/useSettings'
import { formatDate, isUpcoming } from '../utils/formatDate'

function ArrowIcon({ className = '' }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 20 20" fill="none">
      <path d="M4.5 10h11m0 0-4.5-4.5M15.5 10 11 14.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LoadingMessage({ children }) {
  return <p className="rounded-xl border border-border bg-card/55 px-5 py-6 text-sm text-muted-foreground">{children}</p>
}

export default function Home() {
  const { companies, drives, announcements, loading, error, newCounts, hasNew } = useNotifications()
  const { settings } = useSettings()
  const [toastHidden, setToastHidden] = useState(false)
  const [activeTab, setActiveTab] = useState('opportunities')

  const publicCompanies = companies.filter((company) => company.status === 'active' || company.status === 'upcoming')
  const activeCompanies = companies.filter((company) => company.status === 'active')
  const upcomingDrives = drives.filter((drive) => drive.status === 'upcoming')
  const nextDrive = upcomingDrives
    .filter((drive) => isUpcoming(drive.date))
    .sort((a, b) => a.date.localeCompare(b.date))[0]
  const latestAnnouncement = [...announcements]
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))[0]

  const stats = [
    { label: 'Company listings', value: loading ? '' : publicCompanies.length },
    { label: 'Active opportunities', value: loading ? '' : activeCompanies.length },
    { label: 'Upcoming campus drives', value: loading ? '' : upcomingDrives.length },
    { label: 'Students placed', value: settings.studentsPlaced ?? '—' },
  ]

  const tabs = [
    {
      id: 'opportunities',
      label: 'Opportunities',
      badge: loading ? '…' : publicCompanies.length,
      content: loading ? (
        <LoadingMessage>Loading current opportunities…</LoadingMessage>
      ) : error ? (
        <EmptyState title={error} />
      ) : publicCompanies.length === 0 ? (
        <EmptyState title="No active opportunities right now." description="New roles appear here as soon as they are published by the Placement Cell." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {publicCompanies.slice(0, 3).map((company) => <CompanyCard key={company.id} company={company} />)}
        </div>
      ),
    },
    {
      id: 'drives',
      label: 'Campus drives',
      badge: loading ? '…' : upcomingDrives.length,
      content: loading ? (
        <LoadingMessage>Loading the drive calendar…</LoadingMessage>
      ) : error ? (
        <EmptyState title={error} />
      ) : upcomingDrives.length === 0 ? (
        <EmptyState title="No upcoming drives are scheduled." description="Check back for new dates, venues, and recruiter information." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {upcomingDrives.slice(0, 3).map((drive) => <DriveCard key={drive.id} drive={drive} />)}
        </div>
      ),
    },
    {
      id: 'announcements',
      label: 'Bulletin',
      badge: loading ? '…' : announcements.length,
      content: loading ? (
        <LoadingMessage>Loading Placement Cell updates…</LoadingMessage>
      ) : error ? (
        <EmptyState title={error} />
      ) : announcements.length === 0 ? (
        <EmptyState title="There are no published updates yet." description="Important dates and notices from the Placement Cell will appear here." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {[...announcements]
            .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
            .slice(0, 2)
            .map((announcement) => <AnnouncementCard key={announcement.id} announcement={announcement} />)}
        </div>
      ),
    },
  ]

  return (
    <div>
      <section className="home-hero relative overflow-hidden">
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-12 lg:gap-12 lg:py-24">
          <div className="relative z-10 lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-card/65 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary shadow-sm backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              School of Excellence in Law · TNDALU
            </span>
            <h1 className="mt-6 max-w-3xl font-display text-4xl font-semibold leading-[1.06] tracking-tight text-primary sm:text-6xl lg:text-[4.15rem]">
              Make your next move with <span className="text-shimmer">confidence.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Explore career postings, prepare for campus recruitment, and keep up with every Placement Cell update in one place.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <MagneticButton as="link" to="/companies" strength={0.16}>
                Explore opportunities <ArrowIcon className="h-4 w-4" />
              </MagneticButton>
              <MagneticButton as="link" to="/drives" variant="secondary" strength={0.12}>
                View campus drives
              </MagneticButton>
            </div>
            <p className="mt-5 text-sm text-muted-foreground">A student–industry bridge built around your next step.</p>
          </div>

          <SpotlightCard className="p-5 sm:p-6 lg:col-span-5" spotlightColor="rgba(59, 110, 165, 0.15)">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/15" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                    <path d="M4 19.5V7.8a1.8 1.8 0 0 1 1.8-1.8h12.4A1.8 1.8 0 0 1 20 7.8v11.7M8 6V4.8A1.8 1.8 0 0 1 9.8 3h4.4A1.8 1.8 0 0 1 16 4.8V6M3 20h18M8 10h8M8 14h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Student–Industry Interface Centre</p>
                  <p className="mt-1 font-display text-lg font-semibold text-primary">Your placement brief</p>
                </div>
              </div>
              <span className="mt-1 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: 'var(--badge-active-bg)', color: 'var(--badge-active-fg)' }}>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" /> Live
              </span>
            </div>

            <div className="my-6 border-t border-border" />
            {nextDrive ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-secondary">Next campus drive</p>
                <h2 className="mt-2 font-display text-2xl font-semibold leading-tight text-primary">{nextDrive.companyName}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{nextDrive.role}</p>
                <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium text-primary">
                  <span className="rounded-lg bg-muted px-3 py-2">{formatDate(nextDrive.date)}</span>
                  {nextDrive.venue && <span className="max-w-full truncate rounded-lg bg-muted px-3 py-2">{nextDrive.venue}</span>}
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-secondary">A clear place to begin</p>
                <h2 className="mt-2 font-display text-2xl font-semibold leading-tight text-primary">Find the role that fits your path.</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Browse published openings and the application details provided for each role.</p>
              </div>
            )}

            {latestAnnouncement && (
              <div className="mt-6 rounded-xl border border-border/80 bg-card/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">Latest bulletin</p>
                  <span className="text-xs text-muted-foreground">{formatDate(latestAnnouncement.publishedAt)}</span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-primary">{latestAnnouncement.title}</p>
              </div>
            )}

            <Link to={nextDrive ? '/drives' : '/companies'} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary hover:gap-3 focus-visible:rounded-sm transition-all">
              {nextDrive ? 'See drive details' : 'Browse opportunities'} <ArrowIcon className="h-4 w-4" />
            </Link>
          </SpotlightCard>
        </div>
      </section>

      <section aria-label="Placement Cell at a glance" className="relative z-10 mx-auto -mt-1 max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="glass glow-on-hover rounded-2xl p-4 sm:p-5">
              <p className="font-display text-3xl font-semibold tabular-nums text-primary sm:text-4xl">
                {loading && stat.value === '' ? <span className="opacity-40">···</span> : <CountUp value={stat.value} />}
              </p>
              <p className="mt-1.5 text-xs leading-5 text-muted-foreground sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="placement-updates" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-secondary">Stay in the loop</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-primary sm:text-4xl">The latest from placements</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">Openings, drive schedules, and notices, kept together for a simpler search.</p>
          </div>
          <Link to="/companies" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all">
            Browse all opportunities <ArrowIcon className="h-4 w-4" />
          </Link>
        </div>

        <AnimatedTabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
          variant="glass"
          accessibleLabel="Placement Cell updates"
        />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-8 text-primary-foreground sm:px-10 sm:py-10">
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full border border-white/10" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-4 -top-12 h-48 w-48 rounded-full border border-white/10" aria-hidden="true" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground">About the Placement Cell</p>
              <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">Opportunity grows through connection.</h2>
              {settings.aboutText && <p className="mt-3 text-sm leading-6 text-primary-foreground">{settings.aboutText}</p>}
            </div>
            <MagneticButton as="link" to="/about" variant="secondary" className="shrink-0">
              Meet the Placement Cell <ArrowIcon className="h-4 w-4" />
            </MagneticButton>
          </div>
        </div>
      </section>

      {hasNew && !toastHidden && <NewContentToast counts={newCounts} onDismiss={() => setToastHidden(true)} />}
    </div>
  )
}
