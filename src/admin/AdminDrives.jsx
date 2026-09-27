import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllDrives, setDriveStatus } from '../services/driveService'
import { archiveRecord } from '../services/archiveService'
import Badge from '../components/Badge'
import EmptyState from '../components/EmptyState'
import AccessibleDialog from '../components/AccessibleDialog'
import { formatDate, formatTime } from '../utils/formatDate'

export default function AdminDrives() {
  const [drives, setDrives] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pendingAction, setPendingAction] = useState(null)
  const [confirmArchive, setConfirmArchive] = useState(null)
  const headingRef = useRef(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await getAllDrives()
      setDrives(data)
    } catch {
      setError('Unable to load placement drives. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleTogglePublish(drive) {
    const nextStatus = drive.status === 'upcoming' ? 'draft' : 'upcoming'
    setPendingAction(drive.id)
    try {
      await setDriveStatus(drive.id, nextStatus)
      setDrives((list) => list.map((d) => (d.id === drive.id ? { ...d, status: nextStatus } : d)))
    } catch {
      setError('Unable to update status. Please try again.')
    } finally {
      setPendingAction(null)
    }
  }

  async function handleMarkCompleted(drive) {
    setPendingAction(drive.id)
    try {
      await setDriveStatus(drive.id, 'completed')
      setDrives((list) => list.map((d) => (d.id === drive.id ? { ...d, status: 'completed' } : d)))
    } catch {
      setError('Unable to update status. Please try again.')
    } finally {
      setPendingAction(null)
    }
  }

  async function handleArchive(drive) {
    setPendingAction(drive.id)
    try {
      await archiveRecord('drive', drive.id)
      setDrives((list) => list.filter((d) => d.id !== drive.id))
      setConfirmArchive(null)
    } catch {
      setError('Unable to archive drive. Please try again.')
      setConfirmArchive(null)
    } finally {
      setPendingAction(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-1 flex-wrap">
        <h1 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-bold focus-visible:outline focus-visible:outline-2">Placement Drives</h1>
        <Link
          to="/admin/drives/add"
          className="min-h-11 glow-on-hover rounded-full px-5 py-2.5 text-sm font-semibold focus-visible:outline focus-visible:outline-2"
          style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-foreground)' }}
        >
          + Add Drive
        </Link>
      </div>
      <p className="text-muted-foreground mb-6">
        Schedule, publish, close out, and archive campus recruitment drives.
      </p>

      {error && (
        <div role="alert" className="mb-4 rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: 'rgba(248,113,113,0.12)', color: 'var(--color-destructive)' }}>
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading drives…</p>
      ) : drives.length === 0 ? (
        <EmptyState title="No placement drives yet." description="Add your first drive to get started." />
      ) : (
        <div role="region" aria-label="Placement drives list; scroll horizontally to see every column" tabIndex={0} className="glass rounded-xl overflow-x-auto focus-visible:outline focus-visible:outline-2">
          <table className="w-full text-sm min-w-[820px]">
            <thead className="text-left" style={{ backgroundColor: 'var(--color-muted)' }}>
              <tr>
                <th className="px-4 py-3 font-semibold">Company</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Time</th>
                <th className="px-4 py-3 font-semibold">Venue</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {drives.map((d) => (
                <tr key={d.id} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <td className="px-4 py-3 font-medium">{d.companyName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{d.role}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(d.date)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatTime(d.time)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{d.venue}</td>
                  <td className="px-4 py-3"><Badge status={d.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 whitespace-nowrap">
                      <Link to={`/admin/drives/edit/${d.id}`} aria-label={`Edit ${d.companyName} drive`} className="inline-flex min-h-11 items-center px-2 hover:underline focus-visible:outline focus-visible:outline-2" style={{ color: 'var(--color-primary)' }}>
                        Edit
                      </Link>
                      {d.status !== 'completed' && (
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(d)}
                          disabled={pendingAction === d.id}
                          aria-label={`${d.status === 'upcoming' ? 'Unpublish' : 'Publish'} ${d.companyName} drive`}
                          className="min-h-11 px-2 hover:underline disabled:opacity-50 focus-visible:outline focus-visible:outline-2"
                          style={{ color: 'var(--color-primary)' }}
                        >
                          {d.status === 'upcoming' ? 'Unpublish' : 'Publish'}
                        </button>
                      )}
                      {d.status === 'upcoming' && (
                        <button
                          type="button"
                          onClick={() => handleMarkCompleted(d)}
                          disabled={pendingAction === d.id}
                          aria-label={`Mark ${d.companyName} drive completed`}
                          className="min-h-11 px-2 hover:underline disabled:opacity-50 focus-visible:outline focus-visible:outline-2"
                          style={{ color: 'var(--color-primary)' }}
                        >
                          Mark Completed
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setConfirmArchive(d)}
                        disabled={pendingAction === d.id}
                        aria-label={`Archive ${d.companyName} drive`}
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
          labelledBy="archive-drive-title"
          describedBy="archive-drive-description"
          fallbackFocusRef={headingRef}
          closeOnEscape={!pendingAction}
          className="glass rounded-xl p-6 max-w-sm w-full"
        >
            <h2 id="archive-drive-title" className="font-display text-lg font-bold mb-2">Archive this drive?</h2>
            <p id="archive-drive-description" className="text-sm text-muted-foreground mb-6">
              The drive for <span className="font-semibold text-foreground">{confirmArchive.companyName}</span> will be removed from the public site. You can restore it from Archive.
            </p>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setConfirmArchive(null)} disabled={pendingAction === confirmArchive.id} className="min-h-11 rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground disabled:opacity-50">
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
