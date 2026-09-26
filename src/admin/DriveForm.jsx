import { useEffect, useState } from 'react'
import { validateDriveForm } from '../utils/validators'
import { EMPTY_DRIVE_FORM, formValuesToDrive } from './driveFormUtils'
import { getAllCompanies } from '../services/companyService'

const inputClass =
  'w-full rounded-lg glass px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 disabled:opacity-60'
const labelClass = 'block text-sm font-medium mb-1'
const errorClass = 'text-xs mt-1'

function Field({ label, error, children }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
      {error && <p className={errorClass} style={{ color: 'var(--color-destructive)' }}>{error}</p>}
    </div>
  )
}

/**
 * Shared form for /admin/drives/add and /admin/drives/edit/:id. Loads the
 * companies list itself (for the picker) rather than making callers do it —
 * every drive is tied to a company, and a drive form with no companies to
 * choose from is a dead end, so this also surfaces that as an explicit
 * empty state instead of an empty, confusing dropdown.
 */
export default function DriveForm({ initialValues, onSubmit, onCancel, submitting, serverError }) {
  const [form, setForm] = useState(initialValues || EMPTY_DRIVE_FORM)
  const [errors, setErrors] = useState({})
  const [companies, setCompanies] = useState([])
  const [companiesLoading, setCompaniesLoading] = useState(true)
  const [companiesError, setCompaniesError] = useState(null)

  useEffect(() => {
    let cancelled = false
    getAllCompanies()
      .then((data) => { if (!cancelled) setCompanies(data) })
      .catch(() => { if (!cancelled) setCompaniesError('Unable to load companies. Please try again.') })
      .finally(() => { if (!cancelled) setCompaniesLoading(false) })
    return () => { cancelled = true }
  }, [])

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handleCompanyChange(companyId) {
    const company = companies.find((c) => c.id === companyId)
    setForm((f) => ({
      ...f,
      companyId,
      companyName: company?.name || '',
      // Pre-fill the role from the company's listing as a starting point —
      // admin can still override it, since a drive's on-the-day role title
      // doesn't always match the original posting exactly.
      role: f.role || company?.role || '',
    }))
  }

  function handleSubmit(e, targetStatus) {
    e.preventDefault()
    const attemptedForm = { ...form, status: targetStatus }
    const validationErrors = validateDriveForm(attemptedForm)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return
    onSubmit(formValuesToDrive(attemptedForm), targetStatus)
  }

  if (companiesLoading) {
    return <p className="text-muted-foreground text-sm">Loading companies…</p>
  }

  if (companiesError) {
    return (
      <div role="alert" className="rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: 'rgba(248,113,113,0.12)', color: 'var(--color-destructive)' }}>
        {companiesError}
      </div>
    )
  }

  if (companies.length === 0) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <p className="font-semibold mb-1">No companies yet</p>
        <p className="text-sm text-muted-foreground">
          Add a company first — every placement drive needs to be linked to one.
        </p>
      </div>
    )
  }

  return (
    <form className="space-y-8" noValidate>
      {serverError && (
        <div role="alert" className="rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: 'rgba(248,113,113,0.12)', color: 'var(--color-destructive)' }}>
          {serverError}
        </div>
      )}

      <section className="glass rounded-xl p-6">
        <h2 className="font-display text-lg font-bold mb-4">Drive Details</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Company *" error={errors.companyId}>
            <select
              className={inputClass}
              value={form.companyId}
              onChange={(e) => handleCompanyChange(e.target.value)}
              disabled={submitting}
            >
              <option value="">Select a company…</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Role *" error={errors.role}>
            <input className={inputClass} value={form.role} onChange={(e) => update('role', e.target.value)} disabled={submitting} />
          </Field>
          <Field label="Date *" error={errors.date}>
            <input type="date" className={inputClass} value={form.date} onChange={(e) => update('date', e.target.value)} disabled={submitting} />
          </Field>
          <Field label="Time *" error={errors.time}>
            <input type="time" className={inputClass} value={form.time} onChange={(e) => update('time', e.target.value)} disabled={submitting} />
          </Field>
          <Field label="Venue *" error={errors.venue}>
            <input className={inputClass} value={form.venue} onChange={(e) => update('venue', e.target.value)} disabled={submitting} />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Description">
            <textarea className={inputClass} rows={2} value={form.description} onChange={(e) => update('description', e.target.value)} disabled={submitting} />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Instructions">
            <textarea className={inputClass} rows={2} value={form.instructions} onChange={(e) => update('instructions', e.target.value)} disabled={submitting} />
          </Field>
        </div>
      </section>

      <section className="glass rounded-xl p-6">
        <h2 className="font-display text-lg font-bold mb-1">Publishing</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Current status: <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>
            {form.status === 'draft' ? 'Draft' : form.status === 'upcoming' ? 'Upcoming' : 'Completed'}
          </span>
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={(e) => handleSubmit(e, 'draft')} disabled={submitting} className="btn-outline-gold rounded-full px-5 py-2.5 text-sm font-semibold disabled:opacity-60">
            {submitting ? 'Saving…' : 'Save Draft'}
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'upcoming')}
            disabled={submitting}
            className="glow-on-hover rounded-full px-5 py-2.5 text-sm font-semibold disabled:opacity-60"
            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-foreground)' }}
          >
            {submitting ? 'Publishing…' : 'Publish as Upcoming'}
          </button>
          <button type="button" onClick={(e) => handleSubmit(e, 'completed')} disabled={submitting} className="btn-outline-gold rounded-full px-5 py-2.5 text-sm font-semibold disabled:opacity-60">
            Mark Completed
          </button>
          <button type="button" onClick={onCancel} disabled={submitting} className="rounded-full px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground disabled:opacity-60">
            Cancel
          </button>
        </div>
      </section>
    </form>
  )
}
