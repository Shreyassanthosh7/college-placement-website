import { useEffect, useState } from 'react'
import { getSettings, updateSettings } from '../services/settingsService'
import { mockSettings } from '../data/mockData'

const inputClass =
  'w-full rounded-lg glass px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 disabled:opacity-60'
const labelClass = 'block text-sm font-medium mb-1'

function Field({ label, children }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  )
}

export default function AdminSettings() {
  // Falls back to the real current defaults (mockSettings) rather than a
  // blank form — an admin opening Settings for the very first time should
  // see (and can then confirm/edit) what's already live on the site, not
  // an intimidating wall of empty fields.
  const [form, setForm] = useState(mockSettings)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    let cancelled = false
    getSettings()
      .then((doc) => {
        if (cancelled) return
        if (doc) {
          setForm({
            ...mockSettings,
            ...doc,
            social: { ...mockSettings.social, ...(doc.social || {}) },
          })
        }
        // If no doc exists yet, keep the mockSettings-derived defaults
        // already in state — first save will create it.
      })
      .catch(() => { if (!cancelled) setLoadError('Unable to load current settings. Showing defaults instead — saving will still work.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  function update(field, value) {
    setSaved(false)
    setForm((f) => ({ ...f, [field]: value }))
  }

  function updateSocial(platform, value) {
    setSaved(false)
    setForm((f) => ({ ...f, social: { ...f.social, [platform]: value } }))
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setSaveError(null)
    setSaved(false)
    try {
      await updateSettings(form)
      setSaved(true)
    } catch (err) {
      if (err.code === 'permission-denied') {
        setSaveError('Firestore is denying this write (permission-denied). Have you published firestore.rules with a settings block? See the README.')
      } else {
        setSaveError(`Unable to save settings${err.code ? ` (${err.code})` : ''}. Please try again.`)
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p className="text-muted-foreground text-sm">Loading settings…</p>

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1">Settings</h1>
      <p className="text-muted-foreground mb-6">
        Site-wide information shown across the public site. Changes take effect immediately
        after saving — no code changes needed.
      </p>

      {loadError && (
        <div role="alert" className="mb-4 rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: 'rgba(216,185,105,0.15)', color: 'var(--color-primary)' }}>
          {loadError}
        </div>
      )}
      {saveError && (
        <div role="alert" className="mb-4 rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: 'rgba(248,113,113,0.12)', color: 'var(--color-destructive)' }}>
          {saveError}
        </div>
      )}
      {saved && (
        <div role="status" className="mb-4 rounded-lg px-4 py-3 text-sm" style={{ backgroundColor: 'rgba(34,197,94,0.12)', color: '#22c55e' }}>
          Settings saved — the public site now reflects these changes.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <section className="glass rounded-xl p-6">
          <h2 className="font-display text-lg font-bold mb-4">Identity</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="College Name">
              <input className={inputClass} value={form.collegeName} onChange={(e) => update('collegeName', e.target.value)} disabled={saving} />
            </Field>
            <Field label="Placement Cell Name">
              <input className={inputClass} value={form.placementCellName} onChange={(e) => update('placementCellName', e.target.value)} disabled={saving} />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Logo URL">
              <div className="flex items-center gap-3">
                <img
                  src={form.logoUrl}
                  alt="Current logo"
                  className="w-12 h-12 rounded-full object-contain glass p-1"
                  onError={(e) => { e.currentTarget.style.visibility = 'hidden' }}
                  onLoad={(e) => { e.currentTarget.style.visibility = 'visible' }}
                />
                <input
                  className={inputClass}
                  value={form.logoUrl}
                  onChange={(e) => update('logoUrl', e.target.value)}
                  disabled={saving}
                  placeholder="https://…"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Paste a URL to an already-hosted image. This project doesn't use Firebase
                Storage (it requires the paid Blaze plan), so there's no upload button here —
                host the logo image anywhere else and link it.
              </p>
            </Field>
          </div>
        </section>

        <section className="glass rounded-xl p-6">
          <h2 className="font-display text-lg font-bold mb-4">Contact</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Email">
              <input type="email" className={inputClass} value={form.email} onChange={(e) => update('email', e.target.value)} disabled={saving} />
            </Field>
            <Field label="Phone">
              <input className={inputClass} value={form.phone} onChange={(e) => update('phone', e.target.value)} disabled={saving} />
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <Field label="Primary Address">
              <textarea className={inputClass} rows={2} value={form.address} onChange={(e) => update('address', e.target.value)} disabled={saving} />
            </Field>
            <Field label="Secondary Address (optional)">
              <textarea className={inputClass} rows={2} value={form.secondAddress} onChange={(e) => update('secondAddress', e.target.value)} disabled={saving} />
            </Field>
          </div>
          <div className="mt-4">
            <Field label="Office Hours">
              <input className={inputClass} value={form.officeHours} onChange={(e) => update('officeHours', e.target.value)} disabled={saving} />
            </Field>
          </div>
        </section>

        <section className="glass rounded-xl p-6">
          <h2 className="font-display text-lg font-bold mb-4">About &amp; Footer</h2>
          <div className="space-y-4">
            <Field label="About Text (shown on Home and the About page)">
              <textarea className={inputClass} rows={4} value={form.aboutText} onChange={(e) => update('aboutText', e.target.value)} disabled={saving} />
            </Field>
            <Field label="Footer Text">
              <input className={inputClass} value={form.footerText} onChange={(e) => update('footerText', e.target.value)} disabled={saving} />
            </Field>
          </div>
        </section>

        <section className="glass rounded-xl p-6">
          <h2 className="font-display text-lg font-bold mb-4">Homepage Statistics</h2>
          <Field label="Students Placed">
            <input
              type="number"
              min="0"
              step="1"
              inputMode="numeric"
              className={inputClass}
              value={form.studentsPlaced ?? ''}
              onChange={(e) => update('studentsPlaced', e.target.value === '' ? null : Number(e.target.value))}
              disabled={saving}
              placeholder="Leave blank to show —"
            />
            <p className="text-xs text-muted-foreground mt-1">
              This value appears on the Home page. Company and drive counts update from their listings.
            </p>
          </Field>
        </section>

        <section className="glass rounded-xl p-6">
          <h2 className="font-display text-lg font-bold mb-4">Links &amp; Social Media</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="College Website">
              <input className={inputClass} value={form.collegeWebsite} onChange={(e) => update('collegeWebsite', e.target.value)} disabled={saving} />
            </Field>
            <Field label="YouTube">
              <input className={inputClass} value={form.social.youtube} onChange={(e) => updateSocial('youtube', e.target.value)} disabled={saving} />
            </Field>
            <Field label="Twitter / X">
              <input className={inputClass} value={form.social.twitter} onChange={(e) => updateSocial('twitter', e.target.value)} disabled={saving} />
            </Field>
            <Field label="Instagram">
              <input className={inputClass} value={form.social.instagram} onChange={(e) => updateSocial('instagram', e.target.value)} disabled={saving} />
            </Field>
          </div>
        </section>

        <button
          type="submit"
          disabled={saving}
          className="glow-on-hover rounded-full px-6 py-3 text-sm font-semibold disabled:opacity-60"
          style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-primary-foreground)' }}
        >
          {saving ? 'Saving…' : 'Save Settings'}
        </button>
      </form>
    </div>
  )
}
