import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AnnouncementForm from './AnnouncementForm'
import { createAnnouncement } from '../services/announcementService'

export default function AddAnnouncement() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState(null)

  async function handleSubmit(announcementData, status) {
    setSubmitting(true)
    setServerError(null)
    try {
      await createAnnouncement({ ...announcementData, status })
      navigate('/admin/announcements')
    } catch {
      setServerError('Unable to save announcement. Check that Firestore is set up and you have permission to write, then try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1">Add Announcement</h1>
      <p className="text-muted-foreground mb-6">
        Post a new update or deadline. Save as a draft, or publish to make it visible on the
        public site immediately.
      </p>
      <AnnouncementForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/admin/announcements')}
        submitting={submitting}
        serverError={serverError}
      />
    </div>
  )
}
