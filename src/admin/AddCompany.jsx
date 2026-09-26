import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CompanyForm from './CompanyForm'
import { createCompany } from '../services/companyService'

export default function AddCompany() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState(null)

  async function handleSubmit(companyData, status) {
    setSubmitting(true)
    setServerError(null)
    try {
      await createCompany({ ...companyData, status })
      navigate('/admin/companies')
    } catch {
      // Never surface the raw Firestore error (e.g. "permission-denied") to
      // the admin — per spec section 36, map it to something actionable.
      setServerError(
        'Unable to save company. Check that Firestore is set up and you have permission to write, then try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1">Add Company</h1>
      <p className="text-muted-foreground mb-6">
        Create a new placement opportunity. Save as a draft to keep working on it, or publish
        to make it visible on the public site immediately.
      </p>
      <CompanyForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/admin/companies')}
        submitting={submitting}
        serverError={serverError}
      />
    </div>
  )
}
