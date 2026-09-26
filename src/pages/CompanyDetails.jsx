import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Badge from '../components/Badge'
import EmptyState from '../components/EmptyState'
import Reveal from '../components/Reveal'
import { formatDate } from '../utils/formatDate'
import { getCompanyById } from '../services/companyService'

export default function CompanyDetails() {
  const { id } = useParams()
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    // Not redundant with the useState(true) default: this effect re-runs
    // whenever `id` changes (navigating between two company detail pages
    // without a remount), so loading must be reset each time, not just once.
    setLoading(true)
    setError(null)
    getCompanyById(id)
      .then((doc) => {
        if (cancelled) return
        // A draft is never shown on the public site, even if someone has
        // the direct link — same rule the Firestore Security Rules will
        // enforce server-side in Phase 10.
        setCompany(doc && doc.status !== 'draft' ? doc : null)
      })
      .catch(() => { if (!cancelled) setError('Unable to load this opportunity. Please try again later.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [id])

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <p className="text-muted-foreground text-sm">Loading opportunity…</p>
      </div>
    )
  }

  if (error || !company) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <EmptyState
          title={error || 'This opportunity could not be found.'}
          description={error ? undefined : 'It may have been removed or closed. Browse current opportunities instead.'}
        />
        <div className="text-center mt-6">
          <Link to="/companies" className="text-sm font-semibold hover:underline" style={{ color: 'var(--color-primary)' }}>
            ← Back to all opportunities
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Link to="/companies" className="text-sm font-semibold hover:underline" style={{ color: 'var(--color-primary)' }}>
        ← Back to all opportunities
      </Link>

      <Reveal>
      {/* Header */}
      <div className="flex items-start gap-4 mt-4 mb-6">
        <div
          className="w-14 h-14 rounded-md flex items-center justify-center text-white font-bold text-lg shrink-0"
          style={{ backgroundColor: company.logoColor || 'var(--color-primary)' }}
          aria-hidden="true"
        >
          {company.logoInitials || company.logoInitial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-display text-2xl font-bold">{company.name}</h1>
            <Badge status={company.status} />
          </div>
          <p className="text-muted-foreground">{company.role}</p>
        </div>
      </div>

      {/* Key facts */}
      <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 glass rounded-xl p-5">
        <div><dt className="text-xs text-muted-foreground">Package</dt><dd className="font-medium">{company.package}</dd></div>
        <div><dt className="text-xs text-muted-foreground">Location</dt><dd className="font-medium">{company.location}</dd></div>
        <div><dt className="text-xs text-muted-foreground">Work mode</dt><dd className="font-medium">{company.workMode}</dd></div>
        <div><dt className="text-xs text-muted-foreground">Drive date</dt><dd className="font-medium">{formatDate(company.driveDate)}</dd></div>
        <div><dt className="text-xs text-muted-foreground">Application deadline</dt><dd className="font-medium">{formatDate(company.applicationDeadline)}</dd></div>
      </dl>

      {/* About */}
      <section className="mb-8">
        <h2 className="font-display text-lg font-bold mb-2">About the Opportunity</h2>
        <p className="text-muted-foreground">{company.description}</p>
      </section>

      {/* Eligibility */}
      <section className="mb-8">
        <h2 className="font-display text-lg font-bold mb-2">Eligibility</h2>
        <ul className="space-y-1.5 text-sm">
          <li><span className="font-medium">Departments:</span> {company.eligibility?.departments?.join(', ') || '—'}</li>
          <li><span className="font-medium">Minimum CGPA:</span> {company.eligibility?.minimumCGPA ?? '—'}</li>
          <li><span className="font-medium">Backlog requirement:</span> {company.eligibility?.backlogRequirement || 'None specified'}</li>
          {company.eligibility?.other && <li><span className="font-medium">Other:</span> {company.eligibility.other}</li>}
        </ul>
      </section>

      {/* Job description */}
      {company.responsibilities?.length > 0 && (
        <section className="mb-8">
          <h2 className="font-display text-lg font-bold mb-2">Responsibilities</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {company.responsibilities.map((r) => <li key={r}>{r}</li>)}
          </ul>
        </section>
      )}

      {company.instructions && (
        <section className="mb-8">
          <h2 className="font-display text-lg font-bold mb-2">Additional Instructions</h2>
          <p className="text-sm text-muted-foreground">{company.instructions}</p>
        </section>
      )}

      {/* Application */}
      <section className="glass rounded-xl p-6 text-center">
        <p className="text-sm text-muted-foreground mb-4">
          Students interested in this opportunity can apply through the official application form.
        </p>
        {company.googleFormUrl ? (
          <a
            href={company.googleFormUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="glow-on-hover inline-block px-7 py-3.5 rounded-full font-semibold transition-transform duration-200 hover:-translate-y-0.5"
            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-foreground)' }}
          >
            Apply Now →
          </a>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            The application form for this opportunity has not been published yet.
          </p>
        )}
      </section>
      </Reveal>
    </div>
  )
}
