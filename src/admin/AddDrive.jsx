import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DriveForm from './DriveForm'
import { createDrive } from '../services/driveService'

export default function AddDrive() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState(null)

  async function handleSubmit(driveData, status) {
    setSubmitting(true)
    setServerError(null)
    try {
      await createDrive({ ...driveData, status })
      navigate('/admin/drives')
    } catch {
      setServerError('Unable to save drive. Check that Firestore is set up and you have permission to write, then try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1">Add Placement Drive</h1>
      <p className="text-muted-foreground mb-6">
        Schedule a new campus recruitment drive for an existing company listing.
      </p>
      <DriveForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/admin/drives')}
        submitting={submitting}
        serverError={serverError}
      />
    </div>
  )
}
