import { useState } from 'react'
import { validateAnnouncementForm } from '../utils/validators'
import { EMPTY_ANNOUNCEMENT_FORM, formValuesToAnnouncement } from './announcementFormUtils'

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

/** Shared form for /admin/announcements/add and /admin/announcements/edit/:id. */
export default function AnnouncementForm({ initialValues, onSubmit, onCancel, submitting, serverError }) {
  const [form, setForm] = useState(initialValues || EMPTY_ANNOUNCEMENT_FORM)
  const [errors, setErrors] = useState({})

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function handleSubmit(e, targetStatus) {
    e.preventDefault()
    const attemptedForm = { ...form, status: targetStatus }
    const validationErrors = validateAnnouncementForm(attemptedForm)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return
    onSubmit(formValuesToAnnouncement(attemptedForm), targetStatus)
  }

  return (
    <form className="space-y-8" noValidate>
      {serverError && (
        <div role="alert" className="rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: 'rgba(248,113,113,0.12)', color: 'var(--color-destructive)' }}>
          {serverError}
        </div>
      )}

      <section className="glass rounded-xl p-6">
        <h2 className="font-display text-lg font-bold mb-4">Announcement</h2>
        <div className="space-y-4">
          <Field label="Title *" error={errors.title}>
            <input className={inputClass} value={form.title} onChange={(e) => update('title', e.target.value)} disabled={submitting} />
          </Field>
          <Field label="Content *" error={errors.content}>
            <textarea className={inputClass} rows={5} value={form.content} onChange={(e) => update('content', e.target.value)} disabled={submitting} />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Published Date *" error={errors.publishedAt}>
              <input type="date" className={inputClass} value={form.publishedAt} onChange={(e) => update('publishedAt', e.target.value)} disabled={submitting} />
            </Field>
            <Field label="Image URL (optional)" error={errors.imageUrl}>
              <input className={inputClass} value={form.imageUrl} onChange={(e) => update('imageUrl', e.target.value)} disabled={submitting} placeholder="https://…" />
            </Field>
          </div>
          <p className="text-xs text-muted-foreground">
            No file upload here by design — this project doesn't use Firebase Storage (it
            requires the paid Blaze plan). Paste a URL to an already-hosted image if you
            have one; this field is optional.
          </p>
        </div>
      </section>

      <section className="glass rounded-xl p-6">
        <h2 className="font-display text-lg font-bold mb-1">Publishing</h2>
        <p className="text-xs text-muted-foreground mb-4">
          Current status: <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>
            {form.status === 'published' ? 'Published' : 'Draft'}
          </span>
        </p>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={(e) => handleSubmit(e, 'draft')} disabled={submitting} className="btn-outline-gold rounded-full px-5 py-2.5 text-sm font-semibold disabled:opacity-60">
            {submitting ? 'Saving…' : 'Save Draft'}
          </button>
          <button
            type="button"
            onClick={(e) => handleSubmit(e, 'published')}
            disabled={submitting}
            className="glow-on-hover rounded-full px-5 py-2.5 text-sm font-semibold disabled:opacity-60"
            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-foreground)' }}
          >
            {submitting ? 'Publishing…' : 'Publish'}
          </button>
          <button type="button" onClick={onCancel} disabled={submitting} className="rounded-full px-5 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground disabled:opacity-60">
            Cancel
          </button>
        </div>
      </section>
    </form>
  )
}
