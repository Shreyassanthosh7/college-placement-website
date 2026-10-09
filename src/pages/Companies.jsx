import { useEffect, useMemo, useState } from 'react'
import CompanyCard from '../components/CompanyCard'
import EmptyState from '../components/EmptyState'
import Reveal from '../components/Reveal'
import AdaptiveSelect from '../components/ui/AdaptiveSelect'
import { useNotifications } from '../hooks/useNotifications'

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'deadline', label: 'Application Deadline' },
  { value: 'drive', label: 'Drive Date' },
]

export default function Companies() {
  const { companies, loading, error, markCategorySeen } = useNotifications()

  const [query, setQuery] = useState('')
  const [department, setDepartment] = useState('all')
  const [location, setLocation] = useState('all')
  const [status, setStatus] = useState('all')
  const [sort, setSort] = useState('latest')

  // Visiting this page IS "seeing" new companies — clears the navbar
  // bell's companies badge spontaneously, with no separate "mark as read"
  // action needed.
  useEffect(() => {
    markCategorySeen('companies')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const departments = useMemo(
    () => Array.from(new Set(companies.flatMap((c) => c.eligibility?.departments || []))).sort(),
    [companies]
  )
  const locations = useMemo(
    () => Array.from(new Set(companies.map((c) => c.location))).sort(),
    [companies]
  )

  const filtered = useMemo(() => {
    let list = companies.filter((c) => {
      const matchesQuery = c.name.toLowerCase().includes(query.trim().toLowerCase())
      const matchesDept = department === 'all' || (c.eligibility?.departments || []).includes(department)
      const matchesLocation = location === 'all' || c.location === location
      const matchesStatus = status === 'all' || c.status === status
      return matchesQuery && matchesDept && matchesLocation && matchesStatus
    })

    list = [...list].sort((a, b) => {
      if (sort === 'deadline') return new Date(a.applicationDeadline) - new Date(b.applicationDeadline)
      if (sort === 'drive') return new Date(a.driveDate) - new Date(b.driveDate)
      // "latest" — most recently posted first, using Firestore's createdAt
      const aTime = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0
      const bTime = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0
      return bTime - aTime
    })

    return list
  }, [companies, query, department, location, status, sort])

  const selectClass =
    'rounded-full glass px-4 py-2 text-sm focus-visible:outline focus-visible:outline-2 cursor-pointer'

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-display text-3xl font-bold mb-2">Placement Opportunities</h1>
      <p className="text-muted-foreground max-w-2xl mb-6">
        Browse active opportunities from recruiting companies. Search by name or filter by
        department, location, and status.
      </p>

      {/* Search + filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <label className="sr-only" htmlFor="company-search">Search by company name</label>
        <input
          id="company-search"
          type="search"
          placeholder="Search by company name…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 min-w-[200px] rounded-full glass px-4 py-2 text-sm focus-visible:outline focus-visible:outline-2"
          style={{ outlineColor: 'var(--color-ring)' }}
        />

        <label id="filter-department-label" className="sr-only">Filter by department</label>
        <AdaptiveSelect
          id="filter-department"
          ariaLabelledBy="filter-department-label"
          value={department}
          onChange={setDepartment}
          className={selectClass}
          options={[
            { value: 'all', label: 'All departments' },
            ...departments.map((d) => ({ value: d, label: d })),
          ]}
        />

        <label id="filter-location-label" className="sr-only">Filter by location</label>
        <AdaptiveSelect
          id="filter-location"
          ariaLabelledBy="filter-location-label"
          value={location}
          onChange={setLocation}
          className={selectClass}
          options={[
            { value: 'all', label: 'All locations' },
            ...locations.map((l) => ({ value: l, label: l })),
          ]}
        />

        <label id="filter-status-label" className="sr-only">Filter by status</label>
        <AdaptiveSelect
          id="filter-status"
          ariaLabelledBy="filter-status-label"
          value={status}
          onChange={setStatus}
          className={selectClass}
          options={[
            { value: 'all', label: 'All statuses' },
            { value: 'active', label: 'Active' },
            { value: 'upcoming', label: 'Upcoming' },
            { value: 'closed', label: 'Closed' },
          ]}
        />

        <label id="sort-by-label" className="sr-only">Sort opportunities</label>
        <AdaptiveSelect
          id="sort-by"
          ariaLabelledBy="sort-by-label"
          value={sort}
          onChange={setSort}
          className={selectClass}
          options={SORT_OPTIONS.map((o) => ({ value: o.value, label: `Sort: ${o.label}` }))}
        />
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading companies…</p>
      ) : error ? (
        <EmptyState title={error} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={companies.length === 0
            ? 'No active placement opportunities are currently available.'
            : 'No opportunities match your filters.'}
          description={companies.length === 0 ? 'Please check again later.' : 'Try adjusting your search or filters.'}
        />
      ) : (
        <Reveal stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c) => (
            <CompanyCard key={c.id} company={c} />
          ))}
        </Reveal>
      )}
    </div>
  )
}
