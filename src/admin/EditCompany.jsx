import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CompanyForm from './CompanyForm'
import { companyToFormValues } from './companyFormUtils'
import EmptyState from '../components/EmptyState'
import { getCompanyById, updateCompany } from '../services/companyService'

export default function EditCompany() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState(null)

  useEffect(() => {
    let cancelled = false
    // Not redundant with the useState(true) default: this effect re-runs if
    // `id` changes (e.g. navigating directly between two edit URLs), so
    // loading must reset each time, not just on first mount.
    setLoading(true)
    setLoadError(null)
    getCompanyById(id)
      .then((doc) => {
        if (cancelled) return
        setCompany(doc)
      })
      .catch(() => {
        if (cancelled) return
        setLoadError('Unable to load this company. Please try again.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [id])

  async function handleSubmit(companyData, status) {
    setSubmitting(true)
    setServerError(null)
    try {
      await updateCompany(id, { ...companyData, status })
      navigate('/admin/companies')
    } catch {
      setServerError(
        'Unable to save company. Check that Firestore is set up and you have permission to write, then try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <p className="text-muted-foreground text-sm">Loading company…</p>
  }

  if (loadError) {
    return <EmptyState title={loadError} />
  }

  if (!company) {
    return <EmptyState title="This company could not be found." description="It may have been deleted." />
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1">Edit Company</h1>
      <p className="text-muted-foreground mb-6">{company.name}</p>
      <CompanyForm
        initialValues={companyToFormValues(company)}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/admin/companies')}
        submitting={submitting}
        serverError={serverError}
      />
    </div>
  )
}
