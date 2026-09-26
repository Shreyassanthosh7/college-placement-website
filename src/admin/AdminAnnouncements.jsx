import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllAnnouncements, deleteAnnouncement, setAnnouncementStatus } from '../services/announcementService'
import Badge from '../components/Badge'
import EmptyState from '../components/EmptyState'
import { formatDate } from '../utils/formatDate'

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pendingAction, setPendingAction] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

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

  async function handleDelete(announcement) {
    setPendingAction(announcement.id)
    try {
      await deleteAnnouncement(announcement.id)
      setAnnouncements((list) => list.filter((a) => a.id !== announcement.id))
      setConfirmDelete(null)
    } catch {
      setError('Unable to delete announcement. Please try again.')
    } finally {
      setPendingAction(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-1 flex-wrap">
        <h1 className="font-display text-2xl font-bold">Announcements</h1>
        <Link
          to="/admin/announcements/add"
          className="glow-on-hover rounded-full px-5 py-2.5 text-sm font-semibold"
          style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-foreground)' }}
        >
          + Add Announcement
        </Link>
      </div>
      <p className="text-muted-foreground mb-6">
        Post new updates and deadlines, or remove old ones.
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
        <div className="glass rounded-xl overflow-x-auto">
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
                      <Link to={`/admin/announcements/edit/${a.id}`} className="hover:underline" style={{ color: 'var(--color-primary)' }}>
                        Edit
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(a)}
                        disabled={pendingAction === a.id}
                        className="hover:underline disabled:opacity-50"
                        style={{ color: 'var(--color-primary)' }}
                      >
                        {a.status === 'published' ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(a)}
                        disabled={pendingAction === a.id}
                        className="hover:underline disabled:opacity-50"
                        style={{ color: 'var(--color-destructive)' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {confirmDelete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Confirm delete"
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setConfirmDelete(null)}
        >
          <div className="glass rounded-xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-lg font-bold mb-2">Delete this announcement?</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to delete <span className="font-semibold text-foreground">{confirmDelete.title}</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setConfirmDelete(null)} className="rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(confirmDelete)}
                disabled={pendingAction === confirmDelete.id}
                className="rounded-full px-4 py-2 text-sm font-semibold disabled:opacity-60"
                style={{ backgroundColor: 'var(--color-destructive)', color: '#fff' }}
              >
                {pendingAction === confirmDelete.id ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
