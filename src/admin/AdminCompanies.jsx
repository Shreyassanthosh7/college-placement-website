import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllCompanies, setCompanyStatus } from '../services/companyService'
import { archiveRecord } from '../services/archiveService'
import Badge from '../components/Badge'
import EmptyState from '../components/EmptyState'
import AccessibleDialog from '../components/AccessibleDialog'
import { formatDate } from '../utils/formatDate'

export default function AdminCompanies() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pendingAction, setPendingAction] = useState(null) // company id currently being acted on
  const [confirmArchive, setConfirmArchive] = useState(null)
  const headingRef = useRef(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await getAllCompanies()
      setCompanies(data)
    } catch {
      setError('Unable to load companies. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleTogglePublish(company) {
    const nextStatus = company.status === 'active' || company.status === 'upcoming' ? 'draft' : 'active'
    setPendingAction(company.id)
    try {
      await setCompanyStatus(company.id, nextStatus)
      setCompanies((list) => list.map((c) => (c.id === company.id ? { ...c, status: nextStatus } : c)))
    } catch {
      setError('Unable to update status. Please try again.')
    } finally {
      setPendingAction(null)
    }
  }

  async function handleArchive(company) {
    setPendingAction(company.id)
    try {
      await archiveRecord('company', company.id)
      setCompanies((list) => list.filter((c) => c.id !== company.id))
      setConfirmArchive(null)
    } catch {
      setError('Unable to archive company. Please try again.')
      setConfirmArchive(null)
    } finally {
      setPendingAction(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-1 flex-wrap">
        <h1 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-bold focus-visible:outline focus-visible:outline-2">Companies</h1>
        <Link
          to="/admin/companies/add"
          className="min-h-11 glow-on-hover rounded-full px-5 py-2.5 text-sm font-semibold focus-visible:outline focus-visible:outline-2"
          style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-foreground)' }}
        >
          + Add Company
        </Link>
      </div>
      <p className="text-muted-foreground mb-6">
        Add, edit, publish, and archive placement opportunities. Changes appear on the public
        site immediately once published.
      </p>

      {error && (
        <div role="alert" className="mb-4 rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: 'rgba(248,113,113,0.12)', color: 'var(--color-destructive)' }}>
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading companies…</p>
      ) : companies.length === 0 ? (
        <EmptyState title="No companies yet." description="Add your first placement opportunity to get started." />
      ) : (
        <div role="region" aria-label="Companies list; scroll horizontally to see every column" tabIndex={0} className="glass rounded-xl overflow-x-auto focus-visible:outline focus-visible:outline-2">
          <table className="w-full text-sm min-w-[820px]">
            <thead className="text-left" style={{ backgroundColor: 'var(--color-muted)' }}>
              <tr>
                <th className="px-4 py-3 font-semibold">Logo</th>
                <th className="px-4 py-3 font-semibold">Company</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Package</th>
                <th className="px-4 py-3 font-semibold">Drive Date</th>
                <th className="px-4 py-3 font-semibold">Deadline</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c) => (
                <tr key={c.id} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <td className="px-4 py-3">
                    <div
                      className="w-9 h-9 rounded-md flex items-center justify-center text-white font-bold text-xs"
                      style={{ backgroundColor: c.logoColor || 'var(--color-primary)' }}
                      aria-hidden="true"
                    >
                      {c.logoInitials || c.logoInitial || '—'}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.role}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.package}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(c.driveDate)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(c.applicationDeadline)}</td>
                  <td className="px-4 py-3"><Badge status={c.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 whitespace-nowrap">
                      <Link to={`/companies/${c.id}`} target="_blank" rel="noopener noreferrer" aria-label={`View ${c.name} on the public site`} className="inline-flex min-h-11 items-center px-2 hover:underline focus-visible:outline focus-visible:outline-2" style={{ color: 'var(--color-primary)' }}>
                        View
                      </Link>
                      <Link to={`/admin/companies/edit/${c.id}`} aria-label={`Edit ${c.name}`} className="inline-flex min-h-11 items-center px-2 hover:underline focus-visible:outline focus-visible:outline-2" style={{ color: 'var(--color-primary)' }}>
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(c)}
                        disabled={pendingAction === c.id}
                        aria-label={`${c.status === 'active' || c.status === 'upcoming' ? 'Unpublish' : 'Publish'} ${c.name}`}
                        className="min-h-11 px-2 hover:underline disabled:opacity-50 focus-visible:outline focus-visible:outline-2"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        {c.status === 'active' || c.status === 'upcoming' ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmArchive(c)}
                        disabled={pendingAction === c.id}
                        aria-label={`Archive ${c.name}`}
                        className="min-h-11 px-2 hover:underline disabled:opacity-50 focus-visible:outline focus-visible:outline-2"
                        style={{ color: 'var(--color-destructive)' }}
                      >
                        Archive
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {confirmArchive && (
        <AccessibleDialog
          onClose={() => setConfirmArchive(null)}
          labelledBy="archive-company-title"
          describedBy="archive-company-description"
          fallbackFocusRef={headingRef}
          closeOnEscape={!pendingAction}
          className="glass rounded-xl p-6 max-w-sm w-full"
        >
            <h2 id="archive-company-title" className="font-display text-lg font-bold mb-2">Archive this company?</h2>
            <p id="archive-company-description" className="text-sm text-muted-foreground mb-6">
              <span className="font-semibold text-foreground">{confirmArchive.name}</span> will be hidden from the public site. You can restore it from Archive.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmArchive(null)}
                disabled={pendingAction === confirmArchive.id}
                className="min-h-11 rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleArchive(confirmArchive)}
                disabled={pendingAction === confirmArchive.id}
                className="min-h-11 rounded-full px-4 py-2 text-sm font-semibold disabled:opacity-60"
                style={{ backgroundColor: 'var(--color-destructive)', color: '#fff' }}
              >
                {pendingAction === confirmArchive.id ? 'Archiving…' : 'Archive'}
              </button>
            </div>
        </AccessibleDialog>
      )}
    </div>
  )
}
