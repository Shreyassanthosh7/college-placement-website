import { useEffect, useRef, useState } from 'react'
import { archiveRecord } from '../services/archiveService'
import { createPlacement, getAllPlacements, updatePlacement } from '../services/placementService'
import AccessibleDialog from '../components/AccessibleDialog'

const inputClass = 'w-full min-h-11 rounded-lg glass px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 disabled:opacity-60'
const emptyDraft = { id: null, studentName: '', employer: '', role: '', graduationYear: '' }

function sortPlacements(records) {
  return [...records].sort((left, right) =>
    Number(right.graduationYear) - Number(left.graduationYear) || left.studentName.localeCompare(right.studentName)
  )
}

export default function AdminPlacements() {
  const [placements, setPlacements] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [loadAttempt, setLoadAttempt] = useState(0)
  const [draft, setDraft] = useState(null)
  const [confirmArchive, setConfirmArchive] = useState(null)
  const [saving, setSaving] = useState(false)
  const [pendingArchive, setPendingArchive] = useState(null)
  const [formError, setFormError] = useState(null)
  const [actionError, setActionError] = useState(null)
  const [savedMessage, setSavedMessage] = useState('')
  const headingRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setLoadError(null)
    getAllPlacements()
      .then((records) => {
        if (!cancelled) setPlacements(sortPlacements(records))
      })
      .catch(() => {
        if (!cancelled) setLoadError('Unable to load placement records. Please try again.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [loadAttempt])

  function startAdd() {
    setFormError(null)
    setSavedMessage('')
    setDraft({ ...emptyDraft })
  }

  function startEdit(placement) {
    setFormError(null)
    setSavedMessage('')
    setDraft({ ...placement, graduationYear: String(placement.graduationYear) })
  }

  async function savePlacement(event) {
    event.preventDefault()
    const record = {
      studentName: draft.studentName.trim(),
      employer: draft.employer.trim(),
      role: draft.role.trim(),
      graduationYear: Number(draft.graduationYear),
    }
    if (!record.studentName || !record.employer || !record.role || !Number.isInteger(record.graduationYear) || record.graduationYear < 1950 || record.graduationYear > 2100) {
      setFormError('Enter the student, employer, role, and a valid graduation year.')
      return
    }

    setSaving(true)
    setFormError(null)
    try {
      if (draft.id) {
        await updatePlacement(draft.id, record)
        setPlacements((current) => sortPlacements(current.map((item) => item.id === draft.id ? { ...item, ...record } : item)))
        setSavedMessage('Placement record updated.')
      } else {
        const id = await createPlacement(record)
        setPlacements((current) => sortPlacements([...current, { id, ...record }]))
        setSavedMessage('Placement record added. The public homepage total was updated.')
      }
      setDraft(null)
    } catch (error) {
      setFormError(error.code === 'permission-denied'
        ? 'Firestore denied this change. Confirm that the published rules include admin access to placements and settings.'
        : `Unable to save this placement${error.code ? ` (${error.code})` : ''}. Please try again.`)
    } finally {
      setSaving(false)
    }
  }

  async function archivePlacement(placement) {
    setPendingArchive(placement.id)
    setActionError(null)
    try {
      await archiveRecord('placement', placement.id)
      setPlacements((current) => current.filter((item) => item.id !== placement.id))
      setConfirmArchive(null)
      setSavedMessage('Placement archived. The public homepage total was decreased; you can restore it from Archive.')
    } catch (error) {
      setActionError(error.code === 'permission-denied'
        ? 'Firestore denied this change. Confirm that the published rules include the Archive collection.'
        : 'Unable to archive this placement. Please try again.')
    } finally {
      setPendingArchive(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-1 flex-wrap">
        <h1 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-bold focus-visible:outline focus-visible:outline-2">Placements</h1>
        <button
          type="button"
          onClick={startAdd}
          disabled={loading || Boolean(loadError)}
          className="min-h-11 glow-on-hover rounded-full px-5 py-2.5 text-sm font-semibold disabled:opacity-50"
          style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-foreground)' }}
        >
          + Add Placement
        </button>
      </div>
      <p className="text-muted-foreground mb-6">
        Track successful placements. Adding a record increases the public homepage total; archiving one decreases it. Restoring a record reverses that change.
      </p>

      {loadError && (
        <div role="alert" className="mb-4 rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: 'rgba(248,113,113,0.12)', color: 'var(--color-destructive)' }}>
          <p>{loadError}</p>
          <button type="button" onClick={() => setLoadAttempt((attempt) => attempt + 1)} className="min-h-11 mt-2 px-2 font-semibold underline">Retry</button>
        </div>
      )}
      {actionError && !confirmArchive && <div role="alert" className="mb-4 rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: 'rgba(248,113,113,0.12)', color: 'var(--color-destructive)' }}>{actionError}</div>}
      {savedMessage && <div role="status" className="mb-4 rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: '#15803d' }}>{savedMessage}</div>}

      <div className="glass rounded-xl p-4 sm:p-5 mb-5 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs text-muted-foreground">Placement records managed here</p>
          <p className="font-display text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>{loading ? '···' : placements.length}</p>
        </div>
        <p className="text-xs text-muted-foreground max-w-xl">
          Any historical total already in Settings is preserved as a starting count. New records are added to it automatically.
        </p>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading placements…</p>
      ) : !loadError && placements.length === 0 ? (
        <div className="glass rounded-xl p-6 text-sm text-muted-foreground">No placement records yet. Add a record when a student is placed.</div>
      ) : !loadError && (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {placements.map((placement) => (
            <article key={placement.id} className="glass rounded-xl p-5 flex flex-col gap-3">
              <div>
                <p className="font-semibold text-lg">{placement.studentName}</p>
                <p className="text-sm text-muted-foreground">{placement.employer} · {placement.role}</p>
              </div>
              <p className="text-xs text-muted-foreground">Graduation year: {placement.graduationYear}</p>
              <div className="flex flex-wrap gap-2 mt-auto pt-2">
                <button type="button" onClick={() => startEdit(placement)} disabled={Boolean(pendingArchive)} aria-label={`Edit placement record for ${placement.studentName}`} className="min-h-11 rounded-full px-4 text-sm font-semibold border disabled:opacity-50" style={{ borderColor: 'var(--color-border)', color: 'var(--color-primary)' }}>
                  Edit
                </button>
                <button type="button" onClick={() => { setActionError(null); setConfirmArchive(placement) }} disabled={Boolean(pendingArchive)} aria-label={`Archive placement record for ${placement.studentName}`} className="min-h-11 rounded-full px-4 text-sm font-semibold disabled:opacity-50" style={{ color: 'var(--color-destructive)' }}>
                  Archive
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {draft && (
        <AccessibleDialog
          onClose={() => !saving && setDraft(null)}
          labelledBy="placement-dialog-title"
          fallbackFocusRef={headingRef}
          closeOnEscape={!saving}
          closeOnBackdrop={!saving}
          className="glass rounded-xl p-6 max-w-lg w-full"
        >
          <form onSubmit={savePlacement} className="space-y-4">
            <h2 id="placement-dialog-title" className="font-display text-xl font-bold">{draft.id ? 'Edit Placement' : 'Add Placement'}</h2>
            {formError && <div role="alert" className="rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: 'rgba(248,113,113,0.12)', color: 'var(--color-destructive)' }}>{formError}</div>}
            <div>
              <label htmlFor="placement-student" className="block text-sm font-medium mb-1">Student name</label>
              <input id="placement-student" required maxLength={200} className={inputClass} value={draft.studentName} onChange={(event) => setDraft((current) => ({ ...current, studentName: event.target.value }))} disabled={saving} />
            </div>
            <div>
              <label htmlFor="placement-employer" className="block text-sm font-medium mb-1">Employer</label>
              <input id="placement-employer" required maxLength={200} className={inputClass} value={draft.employer} onChange={(event) => setDraft((current) => ({ ...current, employer: event.target.value }))} disabled={saving} />
            </div>
            <div>
              <label htmlFor="placement-role" className="block text-sm font-medium mb-1">Role</label>
              <input id="placement-role" required maxLength={200} className={inputClass} value={draft.role} onChange={(event) => setDraft((current) => ({ ...current, role: event.target.value }))} disabled={saving} />
            </div>
            <div>
              <label htmlFor="placement-year" className="block text-sm font-medium mb-1">Graduation year</label>
              <input id="placement-year" type="number" inputMode="numeric" min="1950" max="2100" step="1" required className={inputClass} value={draft.graduationYear} onChange={(event) => setDraft((current) => ({ ...current, graduationYear: event.target.value }))} disabled={saving} />
            </div>
            <div className="flex justify-end gap-3 pt-1">
              <button type="button" onClick={() => setDraft(null)} disabled={saving} className="min-h-11 rounded-full px-4 text-sm font-semibold text-muted-foreground hover:text-foreground disabled:opacity-50">Cancel</button>
              <button type="submit" disabled={saving} className="min-h-11 rounded-full px-5 text-sm font-semibold disabled:opacity-60" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-foreground)' }}>{saving ? 'Saving…' : 'Save Placement'}</button>
            </div>
          </form>
        </AccessibleDialog>
      )}

      {confirmArchive && (
        <AccessibleDialog
          onClose={() => !pendingArchive && setConfirmArchive(null)}
          labelledBy="archive-placement-title"
          describedBy="archive-placement-description"
          fallbackFocusRef={headingRef}
          closeOnEscape={!pendingArchive}
          closeOnBackdrop={!pendingArchive}
          className="glass rounded-xl p-6 max-w-sm w-full"
        >
          {actionError && <div role="alert" className="mb-4 rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: 'rgba(248,113,113,0.12)', color: 'var(--color-destructive)' }}>{actionError}</div>}
          <h2 id="archive-placement-title" className="font-display text-lg font-bold mb-2">Archive this placement?</h2>
          <p id="archive-placement-description" className="text-sm text-muted-foreground mb-6">{confirmArchive.studentName}'s record will be removed from the list and the homepage total. You can restore it later from Archive.</p>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setConfirmArchive(null)} disabled={Boolean(pendingArchive)} className="min-h-11 rounded-full px-4 text-sm font-semibold text-muted-foreground disabled:opacity-50">Cancel</button>
            <button type="button" onClick={() => archivePlacement(confirmArchive)} disabled={Boolean(pendingArchive)} className="min-h-11 rounded-full px-4 text-sm font-semibold disabled:opacity-60" style={{ backgroundColor: 'var(--color-destructive)', color: '#fff' }}>{pendingArchive ? 'Archiving…' : 'Archive'}</button>
          </div>
        </AccessibleDialog>
      )}
    </div>
  )
}
