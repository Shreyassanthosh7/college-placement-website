import { useState } from 'react'
import { validateCompanyForm } from '../utils/validators'
import { EMPTY_FORM, formValuesToCompany } from './companyFormUtils'

const WORK_MODES = ['On-site', 'Remote', 'Hybrid']
const STATUSES = [
  { value: 'draft', label: 'Draft' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'active', label: 'Active' },
  { value: 'closed', label: 'Closed' },
]

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
 * Shared form for both /admin/companies/add and /admin/companies/edit/:id.
 * The parent page owns the actual Firestore call (createCompany /
 * updateCompany) and passes it in as `onSubmit(companyData, status)` —
 * this component only owns form state and validation.
 */
export default function CompanyForm({ initialValues, onSubmit, onCancel, submitting, serverError }) {
  const [form, setForm] = useState(initialValues || EMPTY_FORM)
  const [errors, setErrors] = useState({})

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handleSubmit(e, targetStatus) {
    e.preventDefault()
    const attemptedForm = { ...form, status: targetStatus }
    const validationErrors = validateCompanyForm(attemptedForm)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return
    onSubmit(formValuesToCompany(attemptedForm), targetStatus)
  }

  return (
    <form className="space-y-8" noValidate>
      {serverError && (
        <div role="alert" className="rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: 'rgba(248,113,113,0.12)', color: 'var(--color-destructive)' }}>
          {serverError}
        </div>
      )}

      {/* Company Information */}
      <section className="glass rounded-xl p-6">
        <h2 className="font-display text-lg font-bold mb-4">Company Information</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Company Name *" error={errors.name}>
            <input className={inputClass} value={form.name} onChange={(e) => update('name', e.target.value)} disabled={submitting} />
          </Field>
          <Field label="Job Role *" error={errors.role}>
            <input className={inputClass} value={form.role} onChange={(e) => update('role', e.target.value)} disabled={submitting} />
          </Field>
          <Field label="Logo Initials (shown as a colored badge)">
            <input className={inputClass} maxLength={3} value={form.logoInitials} onChange={(e) => update('logoInitials', e.target.value)} disabled={submitting} placeholder="e.g. TN" />
          </Field>
          <Field label="Logo Badge Color">
            <input type="color" className="w-full h-10 rounded-lg glass px-1 py-1 disabled:opacity-60" value={form.logoColor} onChange={(e) => update('logoColor', e.target.value)} disabled={submitting} />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Description">
            <textarea className={inputClass} rows={3} value={form.description} onChange={(e) => update('description', e.target.value)} disabled={submitting} />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Responsibilities (one per line)">
            <textarea className={inputClass} rows={4} value={form.responsibilities} onChange={(e) => update('responsibilities', e.target.value)} disabled={submitting} />
          </Field>
        </div>
      </section>

      {/* Eligibility */}
      <section className="glass rounded-xl p-6">
        <h2 className="font-display text-lg font-bold mb-4">Eligibility</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Eligible Departments (comma-separated)">
            <input className={inputClass} value={form.departments} onChange={(e) => update('departments', e.target.value)} disabled={submitting} placeholder="B.A. B.L. (Hons.), LL.B." />
          </Field>
          <Field label="Minimum CGPA *" error={errors.minimumCGPA}>
            <input type="number" step="0.1" min="0" max="10" className={inputClass} value={form.minimumCGPA} onChange={(e) => update('minimumCGPA', e.target.value)} disabled={submitting} />
          </Field>
          <Field label="Backlog Requirement">
            <input className={inputClass} value={form.backlogRequirement} onChange={(e) => update('backlogRequirement', e.target.value)} disabled={submitting} placeholder="e.g. No standing backlogs" />
          </Field>
          <Field label="Other Eligibility Requirements">
            <input className={inputClass} value={form.otherEligibility} onChange={(e) => update('otherEligibility', e.target.value)} disabled={submitting} />
          </Field>
        </div>
      </section>

      {/* Job Information */}
      <section className="glass rounded-xl p-6">
        <h2 className="font-display text-lg font-bold mb-4">Job Information</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <Field label="Package *" error={errors.package}>
            <input className={inputClass} value={form.package} onChange={(e) => update('package', e.target.value)} disabled={submitting} placeholder="₹6,00,000 / year" />
          </Field>
          <Field label="Location *" error={errors.location}>
            <input className={inputClass} value={form.location} onChange={(e) => update('location', e.target.value)} disabled={submitting} />
          </Field>
          <Field label="Work Mode">
            <select className={inputClass} value={form.workMode} onChange={(e) => update('workMode', e.target.value)} disabled={submitting}>
              {WORK_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </Field>
        </div>
      </section>

      {/* Placement Information */}
      <section className="glass rounded-xl p-6">
        <h2 className="font-display text-lg font-bold mb-4">Placement Information</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Drive Date *" error={errors.driveDate}>
            <input type="date" className={inputClass} value={form.driveDate} onChange={(e) => update('driveDate', e.target.value)} disabled={submitting} />
          </Field>
          <Field label="Application Deadline *" error={errors.applicationDeadline}>
            <input type="date" className={inputClass} value={form.applicationDeadline} onChange={(e) => update('applicationDeadline', e.target.value)} disabled={submitting} />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Google Form URL (required to publish)" error={errors.googleFormUrl}>
            <input className={inputClass} value={form.googleFormUrl} onChange={(e) => update('googleFormUrl', e.target.value)} disabled={submitting} placeholder="https://forms.gle/…" />
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Additional Instructions">
            <textarea className={inputClass} rows={2} value={form.instructions} onChange={(e) => update('instructions', e.target.value)} disabled={submitting} />
          </Field>
        </div>
      </section>

      {/* Publishing */}
      <section className="glass rounded-xl p-6">
        <h2 className="font-display text-lg font-bold mb-1">Publishing</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Current status: <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>{STATUSES.find((s) => s.value === form.status)?.label}</span>
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'draft')}
            disabled={submitting}
            className="btn-outline-gold rounded-full px-5 py-2.5 text-sm font-semibold disabled:opacity-60"
          >
            {submitting ? 'Saving…' : 'Save Draft'}
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, form.status === 'closed' ? 'closed' : 'active')}
            disabled={submitting}
            className="glow-on-hover rounded-full px-5 py-2.5 text-sm font-semibold disabled:opacity-60"
            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-foreground)' }}
          >
            {submitting ? 'Publishing…' : 'Publish'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="rounded-full px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground disabled:opacity-60"
          >
            Cancel
          </button>
        </div>
      </section>
    </form>
  )
}
