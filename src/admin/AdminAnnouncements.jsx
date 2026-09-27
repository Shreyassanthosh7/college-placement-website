import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllAnnouncements, setAnnouncementStatus } from '../services/announcementService'
import { archiveRecord } from '../services/archiveService'
import Badge from '../components/Badge'
import EmptyState from '../components/EmptyState'
import AccessibleDialog from '../components/AccessibleDialog'
import { formatDate } from '../utils/formatDate'

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pendingAction, setPendingAction] = useState(null)
  const [confirmArchive, setConfirmArchive] = useState(null)
  const headingRef = useRef(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const data = await getAllAnnouncements()
      setAnnouncements(data)
    } catch {
      setError('Unable to load announcements. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function handleTogglePublish(announcement) {
    const nextStatus = announcement.status === 'published' ? 'draft' : 'published'
    setPendingAction(announcement.id)
    try {
      await setAnnouncementStatus(announcement.id, nextStatus)
      setAnnouncements((list) => list.map((a) => (a.id === announcement.id ? { ...a, status: nextStatus } : a)))
    } catch {
      setError('Unable to update status. Please try again.')
    } finally {
      setPendingAction(null)
    }
  }

  async function handleArchive(announcement) {
    setPendingAction(announcement.id)
    try {
      await archiveRecord('announcement', announcement.id)
      setAnnouncements((list) => list.filter((a) => a.id !== announcement.id))
      setConfirmArchive(null)
    } catch {
      setError('Unable to archive announcement. Please try again.')
      setConfirmArchive(null)
    } finally {
      setPendingAction(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-1 flex-wrap">
        <h1 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-bold focus-visible:outline focus-visible:outline-2">Announcements</h1>
        <Link
          to="/admin/announcements/add"
          className="min-h-11 glow-on-hover rounded-full px-5 py-2.5 text-sm font-semibold focus-visible:outline focus-visible:outline-2"
          style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-foreground)' }}
        >
          + Add Announcement
        </Link>
      </div>
      <p className="text-muted-foreground mb-6">
        Post new updates and deadlines, or archive old ones.
      </p>

      {error && (
        <div role="alert" className="mb-4 rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: 'rgba(248,113,113,0.12)', color: 'var(--color-destructive)' }}>
          {error}
        </div>
      )}

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading announcements…</p>
      ) : announcements.length === 0 ? (
        <EmptyState title="No announcements yet." description="Add your first announcement to get started." />
      ) : (
        <div role="region" aria-label="Announcements list; scroll horizontally to see every column" tabIndex={0} className="glass rounded-xl overflow-x-auto focus-visible:outline focus-visible:outline-2">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="text-left" style={{ backgroundColor: 'var(--color-muted)' }}>
              <tr>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Published</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((a) => (
                <tr key={a.id} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <td className="px-4 py-3 font-medium">{a.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(a.publishedAt)}</td>
                  <td className="px-4 py-3"><Badge status={a.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 whitespace-nowrap">
                      <Link to={`/admin/announcements/edit/${a.id}`} aria-label={`Edit ${a.title}`} className="inline-flex min-h-11 items-center px-2 hover:underline focus-visible:outline focus-visible:outline-2" style={{ color: 'var(--color-primary)' }}>
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(a)}
                        disabled={pendingAction === a.id}
                        aria-label={`${a.status === 'published' ? 'Unpublish' : 'Publish'} ${a.title}`}
                        className="min-h-11 px-2 hover:underline disabled:opacity-50 focus-visible:outline focus-visible:outline-2"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        {a.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmArchive(a)}
                        disabled={pendingAction === a.id}
                        aria-label={`Archive ${a.title}`}
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
          labelledBy="archive-announcement-title"
          describedBy="archive-announcement-description"
          fallbackFocusRef={headingRef}
          closeOnEscape={!pendingAction}
          className="glass rounded-xl p-6 max-w-sm w-full"
        >
            <h2 id="archive-announcement-title" className="font-display text-lg font-bold mb-2">Archive this announcement?</h2>
            <p id="archive-announcement-description" className="text-sm text-muted-foreground mb-6">
              <span className="font-semibold text-foreground">{confirmArchive.title}</span> will be removed from the public site. You can restore it from Archive.
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
