import { useEffect, useState } from 'react'
import { getSettings, updateSettings } from '../services/settingsService'
import { mockSettings } from '../data/mockData'

const inputClass = 'w-full rounded-lg glass px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 disabled:opacity-60'

function normalizeMembers(members) {
  return members.map((member, index) => ({
    id: member?.id || `team-member-${index + 1}`,
    name: typeof member?.name === 'string' ? member.name : '',
    designation: typeof member?.designation === 'string' ? member.designation : '',
  }))
}

function makeMemberId() {
  return globalThis.crypto?.randomUUID?.() || `team-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export default function AdminTeam() {
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [loadAttempt, setLoadAttempt] = useState(0)
  const [draft, setDraft] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setLoadError(null)
    getSettings()
      .then((settings) => {
        if (cancelled) return
        const members = Array.isArray(settings?.teamMembers) ? settings.teamMembers : mockSettings.teamMembers
        setTeamMembers(normalizeMembers(members))
      })
      .catch(() => {
        if (!cancelled) setLoadError('Unable to load the Team list. Reload it before making changes.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [loadAttempt])

  function startAdd() {
    setSaveError(null)
    setDraft({ id: null, name: '', designation: '' })
  }

  function startEdit(member) {
    setSaveError(null)
    setDraft({ ...member })
  }

  async function saveMember(event) {
    event.preventDefault()
    const member = {
      id: draft.id || makeMemberId(),
      name: draft.name.trim(),
      designation: draft.designation.trim(),
    }
    if (!member.name || !member.designation) {
      setSaveError('Enter both a name and designation.')
      return
    }
    const nextMembers = draft.id
      ? teamMembers.map((existing) => existing.id === draft.id ? member : existing)
      : [...teamMembers, member]

    setSaving(true)
    setSaveError(null)
    try {
      await updateSettings({ teamMembers: nextMembers })
      setTeamMembers(nextMembers)
      setDraft(null)
    } catch (error) {
      setSaveError(error.code === 'permission-denied'
        ? 'Firestore denied this change. Confirm that your admin account can update settings.'
        : `Unable to save this team member${error.code ? ` (${error.code})` : ''}. Please try again.`)
    } finally {
      setSaving(false)
    }
  }

  async function deleteMember(member) {
    const nextMembers = teamMembers.filter((existing) => existing.id !== member.id)
    setSaving(true)
    setSaveError(null)
    try {
      await updateSettings({ teamMembers: nextMembers })
      setTeamMembers(nextMembers)
      setConfirmDelete(null)
    } catch (error) {
      setSaveError(error.code === 'permission-denied'
        ? 'Firestore denied this change. Confirm that your admin account can update settings.'
        : `Unable to delete this team member${error.code ? ` (${error.code})` : ''}. Please try again.`)
      setConfirmDelete(null)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-1 flex-wrap">
        <h1 className="font-display text-2xl font-bold">Team</h1>
        <button
          type="button"
          onClick={startAdd}
          disabled={loading || Boolean(loadError) || saving}
          className="glow-on-hover rounded-full px-5 py-2.5 text-sm font-semibold disabled:opacity-50"
          style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-foreground)' }}
        >
          + Add Team Member
        </button>
      </div>
      <p className="text-muted-foreground mb-6">
        Manage the names and designations displayed on the public About page.
      </p>

      {loadError && (
        <div role="alert" className="mb-4 rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: 'rgba(248,113,113,0.12)', color: 'var(--color-destructive)' }}>
          <p>{loadError}</p>
          <button type="button" onClick={() => setLoadAttempt((attempt) => attempt + 1)} className="mt-2 font-semibold underline">
            Retry
          </button>
        </div>
      )}
      {saveError && !draft && (
        <div role="alert" className="mb-4 rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: 'rgba(248,113,113,0.12)', color: 'var(--color-destructive)' }}>
          {saveError}
        </div>
      )}

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading team members…</p>
      ) : !loadError && teamMembers.length === 0 ? (
        <div className="glass rounded-xl p-6 text-sm text-muted-foreground">
          No team members have been added.
        </div>
      ) : !loadError && (
        <div className="glass rounded-xl overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead className="text-left" style={{ backgroundColor: 'var(--color-muted)' }}>
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Designation</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => (
                <tr key={member.id} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <td className="px-4 py-3 font-medium">{member.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{member.designation}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-4 whitespace-nowrap">
                      <button type="button" onClick={() => startEdit(member)} disabled={saving} className="hover:underline disabled:opacity-50" style={{ color: 'var(--color-primary)' }}>
                        Edit
                      </button>
                      <button type="button" onClick={() => setConfirmDelete(member)} disabled={saving} className="hover:underline disabled:opacity-50" style={{ color: 'var(--color-destructive)' }}>
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

      {draft && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={draft.id ? 'Edit team member' : 'Add team member'}
          className="fixed inset-0 z-50 bg-slate-900/30 flex items-center justify-center p-4"
          onClick={() => !saving && setDraft(null)}
        >
          <form className="glass rounded-xl p-6 max-w-lg w-full space-y-4" onSubmit={saveMember} onClick={(event) => event.stopPropagation()}>
            <h2 className="font-display text-xl font-bold">{draft.id ? 'Edit Team Member' : 'Add Team Member'}</h2>
            {saveError && (
              <div role="alert" className="rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: 'rgba(248,113,113,0.12)', color: 'var(--color-destructive)' }}>
                {saveError}
              </div>
            )}
            <div>
              <label htmlFor="team-name" className="block text-sm font-medium mb-1">Name</label>
              <input
                id="team-name"
                autoFocus
                required
                maxLength={200}
                className={inputClass}
                value={draft.name}
                onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))}
                disabled={saving}
              />
            </div>
            <div>
              <label htmlFor="team-designation" className="block text-sm font-medium mb-1">Designation</label>
              <input
                id="team-designation"
                required
                maxLength={200}
                className={inputClass}
                value={draft.designation}
                onChange={(event) => setDraft((current) => ({ ...current, designation: event.target.value }))}
                disabled={saving}
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setDraft(null)} disabled={saving} className="rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground disabled:opacity-50">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="rounded-full px-5 py-2 text-sm font-semibold disabled:opacity-60" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-foreground)' }}>
                {saving ? 'Saving…' : 'Save Member'}
              </button>
            </div>
          </form>
        </div>
      )}

      {confirmDelete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Confirm team member deletion"
          className="fixed inset-0 z-50 bg-slate-900/30 flex items-center justify-center p-4"
          onClick={() => !saving && setConfirmDelete(null)}
        >
          <div className="glass rounded-xl p-6 max-w-sm w-full" onClick={(event) => event.stopPropagation()}>
            <h2 className="font-display text-lg font-bold mb-2">Delete this team member?</h2>
            <p className="text-sm text-muted-foreground mb-6">
              <span className="font-semibold text-foreground">{confirmDelete.name}</span> will be removed from the public Team list.
            </p>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setConfirmDelete(null)} disabled={saving} className="rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground disabled:opacity-50">
                Cancel
              </button>
              <button type="button" onClick={() => deleteMember(confirmDelete)} disabled={saving} className="rounded-full px-4 py-2 text-sm font-semibold disabled:opacity-60" style={{ backgroundColor: 'var(--color-destructive)', color: '#fff' }}>
                {saving ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
