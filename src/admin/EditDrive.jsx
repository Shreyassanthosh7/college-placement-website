import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DriveForm from './DriveForm'
import { driveToFormValues } from './driveFormUtils'
import EmptyState from '../components/EmptyState'
import { getDriveById, updateDrive } from '../services/driveService'

export default function EditDrive() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [drive, setDrive] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState(null)

  useEffect(() => {
    let cancelled = false
    // Not redundant with the useState(true) default: this effect re-runs if
    // `id` changes, so loading must reset each time, not just on first mount.
    setLoading(true)
    setLoadError(null)
    getDriveById(id)
      .then((doc) => { if (!cancelled) setDrive(doc) })
      .catch(() => { if (!cancelled) setLoadError('Unable to load this drive. Please try again.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [id])

  async function handleSubmit(driveData, status) {
    setSubmitting(true)
    setServerError(null)
    try {
      await updateDrive(id, { ...driveData, status })
      navigate('/admin/drives')
    } catch {
      setServerError('Unable to save drive. Check that Firestore is set up and you have permission to write, then try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p className="text-muted-foreground text-sm">Loading drive…</p>
  if (loadError) return <EmptyState title={loadError} />
  if (!drive) return <EmptyState title="This drive could not be found." description="It may have been deleted." />

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1">Edit Placement Drive</h1>
      <p className="text-muted-foreground mb-6">{drive.companyName} — {drive.role}</p>
      <DriveForm
        initialValues={driveToFormValues(drive)}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/admin/drives')}
        submitting={submitting}
        serverError={serverError}
      />
    </div>
  )
}
