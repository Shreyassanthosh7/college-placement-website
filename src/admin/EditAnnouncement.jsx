import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AnnouncementForm from './AnnouncementForm'
import { announcementToFormValues } from './announcementFormUtils'
import EmptyState from '../components/EmptyState'
import { getAnnouncementById, updateAnnouncement } from '../services/announcementService'

export default function EditAnnouncement() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [announcement, setAnnouncement] = useState(null)
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
    getAnnouncementById(id)
      .then((doc) => { if (!cancelled) setAnnouncement(doc) })
      .catch(() => { if (!cancelled) setLoadError('Unable to load this announcement. Please try again.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [id])

  async function handleSubmit(announcementData, status) {
    setSubmitting(true)
    setServerError(null)
    try {
      await updateAnnouncement(id, { ...announcementData, status })
      navigate('/admin/announcements')
    } catch {
      setServerError('Unable to save announcement. Check that Firestore is set up and you have permission to write, then try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p className="text-muted-foreground text-sm">Loading announcement…</p>
  if (loadError) return <EmptyState title={loadError} />
  if (!announcement) return <EmptyState title="This announcement could not be found." description="It may have been deleted." />

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1">Edit Announcement</h1>
      <p className="text-muted-foreground mb-6">{announcement.title}</p>
      <AnnouncementForm
        initialValues={announcementToFormValues(announcement)}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/admin/announcements')}
        submitting={submitting}
        serverError={serverError}
      />
    </div>
  )
}
