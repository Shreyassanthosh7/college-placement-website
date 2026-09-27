import { useEffect, useRef, useState } from 'react'
import {
  getArchivedRecords,
  permanentlyDeleteArchivedRecord,
  restoreArchivedRecord,
} from '../services/archiveService'
import AccessibleDialog from '../components/AccessibleDialog'

const TYPE_LABELS = {
  company: 'Company',
  drive: 'Placement drive',
  announcement: 'Announcement',
  team: 'Team member',
  placement: 'Placement record',
}
const FILTERS = ['all', ...Object.keys(TYPE_LABELS)]

function archiveDetails(item) {
  const record = item.record || {}
  if (item.entityType === 'company') return [record.role, record.location].filter(Boolean).join(' · ')
  if (item.entityType === 'drive') return [record.role, record.date].filter(Boolean).join(' · ')
  if (item.entityType === 'announcement') return record.publishedAt ? `Published ${record.publishedAt}` : ''
  if (item.entityType === 'team') return record.designation || ''
  if (item.entityType === 'placement') return [record.employer, record.role, record.graduationYear].filter(Boolean).join(' · ')
  return ''
}

function formatArchivedAt(value) {
  const date = typeof value?.toDate === 'function' ? value.toDate() : null
  return date ? `Archived ${date.toLocaleDateString()}` : 'Recently archived'
}

export default function AdminArchive() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [loadAttempt, setLoadAttempt] = useState(0)
  const [pendingId, setPendingId] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [actionError, setActionError] = useState(null)
  const [notice, setNotice] = useState('')
  const headingRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setLoadError(null)
    getArchivedRecords()
      .then((records) => {
        if (!cancelled) setItems(records)
      })
      .catch(() => {
        if (!cancelled) setLoadError('Unable to load archived items. Confirm that the published Firestore rules include the Archive collection.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [loadAttempt])

  const visibleItems = filter === 'all' ? items : items.filter((item) => item.entityType === filter)

  async function restore(item) {
    setPendingId(item.id)
    setActionError(null)
    setNotice('')
    try {
      await restoreArchivedRecord(item.id)
      setItems((current) => current.filter((entry) => entry.id !== item.id))
      setNotice(`${TYPE_LABELS[item.entityType] || 'Item'} restored.`)
    } catch (error) {
      const message = error.message === 'record-already-exists' || error.message === 'team-member-already-exists'
        ? 'An item with this identity already exists. Archive restoration was stopped to avoid overwriting it.'
        : error.code === 'permission-denied'
          ? 'Firestore denied this change. Confirm that the published rules include the source collection, settings, and Archive collection.'
          : 'Unable to restore this item. Please try again.'
      setActionError(message)
    } finally {
      setPendingId(null)
    }
  }

  async function deletePermanently(item) {
    setPendingId(item.id)
    setActionError(null)
    try {
      await permanentlyDeleteArchivedRecord(item.id)
      setItems((current) => current.filter((entry) => entry.id !== item.id))
      setConfirmDelete(null)
      setNotice('Archived item permanently deleted.')
    } catch {
      setActionError('Unable to permanently delete this archived item. Please try again.')
    } finally {
      setPendingId(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-1 flex-wrap">
        <h1 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-bold focus-visible:outline focus-visible:outline-2">Archive</h1>
        <span className="text-sm text-muted-foreground">{items.length} archived {items.length === 1 ? 'item' : 'items'}</span>
      </div>
      <p className="text-muted-foreground mb-5">Archived items are hidden from the public site. Restore one at any time or delete it permanently.</p>

      {loadError && (
        <div role="alert" className="mb-4 rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: 'rgba(248,113,113,0.12)', color: 'var(--color-destructive)' }}>
          <p>{loadError}</p>
          <button type="button" onClick={() => setLoadAttempt((attempt) => attempt + 1)} className="min-h-11 mt-2 px-2 font-semibold underline">Retry</button>
        </div>
      )}
      {actionError && !confirmDelete && <div role="alert" className="mb-4 rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: 'rgba(248,113,113,0.12)', color: 'var(--color-destructive)' }}>{actionError}</div>}
      {notice && <div role="status" className="mb-4 rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: '#15803d' }}>{notice}</div>}

      <div className="flex gap-2 overflow-x-auto pb-2 mb-4" role="group" aria-label="Filter archive by type">
        {FILTERS.map((type) => {
          const selected = filter === type
          return (
            <button
              key={type}
              type="button"
              aria-pressed={selected}
              onClick={() => setFilter(type)}
              className="min-h-11 shrink-0 rounded-full px-4 text-sm font-medium border transition-colors"
              style={selected
                ? { backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-foreground)', borderColor: 'var(--color-primary)' }
                : { borderColor: 'var(--color-border)', color: 'var(--color-foreground)' }}
            >
              {type === 'all' ? 'All types' : TYPE_LABELS[type]}
            </button>
          )
        })}
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading archive…</p>
      ) : !loadError && visibleItems.length === 0 ? (
        <div className="glass rounded-xl p-6 text-sm text-muted-foreground">{items.length === 0 ? 'Nothing has been archived yet.' : 'There are no archived items in this category.'}</div>
      ) : !loadError && (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {visibleItems.map((item) => (
            <article key={item.id} className="glass rounded-xl p-5 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="inline-flex rounded-full px-2.5 py-1 text-xs font-semibold mb-2" style={{ backgroundColor: 'var(--color-muted)', color: 'var(--color-primary)' }}>
                    {TYPE_LABELS[item.entityType] || 'Archived item'}
                  </span>
                  <h2 className="font-semibold break-words">{item.label || 'Archived item'}</h2>
                </div>
              </div>
              {archiveDetails(item) && <p className="text-sm text-muted-foreground break-words">{archiveDetails(item)}</p>}
              <p className="text-xs text-muted-foreground">{formatArchivedAt(item.archivedAt)}</p>
              <div className="flex flex-wrap gap-2 mt-auto pt-2">
                <button type="button" onClick={() => restore(item)} disabled={Boolean(pendingId)} aria-label={`Restore ${item.label || 'archived item'}`} className="min-h-11 rounded-full px-4 text-sm font-semibold disabled:opacity-50" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-foreground)' }}>
                  {pendingId === item.id ? 'Restoring…' : 'Restore'}
                </button>
                <button type="button" onClick={() => { setActionError(null); setConfirmDelete(item) }} disabled={Boolean(pendingId)} aria-label={`Delete ${item.label || 'archived item'} permanently`} className="min-h-11 rounded-full px-4 text-sm font-semibold disabled:opacity-50" style={{ color: 'var(--color-destructive)' }}>
                  Delete permanently
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {confirmDelete && (
        <AccessibleDialog
          onClose={() => !pendingId && setConfirmDelete(null)}
          labelledBy="permanent-delete-title"
          describedBy="permanent-delete-description"
          fallbackFocusRef={headingRef}
          closeOnEscape={!pendingId}
          closeOnBackdrop={!pendingId}
          className="glass rounded-xl p-6 max-w-sm w-full"
        >
          {actionError && <div role="alert" className="mb-4 rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: 'rgba(248,113,113,0.12)', color: 'var(--color-destructive)' }}>{actionError}</div>}
          <h2 id="permanent-delete-title" className="font-display text-lg font-bold mb-2">Delete permanently?</h2>
          <p id="permanent-delete-description" className="text-sm text-muted-foreground mb-6">
            “{confirmDelete.label || 'Archived item'}” will be erased and cannot be restored.
          </p>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setConfirmDelete(null)} disabled={Boolean(pendingId)} className="min-h-11 rounded-full px-4 text-sm font-semibold text-muted-foreground disabled:opacity-50">Cancel</button>
            <button type="button" onClick={() => deletePermanently(confirmDelete)} disabled={Boolean(pendingId)} className="min-h-11 rounded-full px-4 text-sm font-semibold disabled:opacity-60" style={{ backgroundColor: 'var(--color-destructive)', color: '#fff' }}>{pendingId ? 'Deleting…' : 'Delete permanently'}</button>
          </div>
        </AccessibleDialog>
      )}
    </div>
  )
}
