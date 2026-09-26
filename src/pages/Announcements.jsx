import { useEffect } from 'react'
import AnnouncementCard from '../components/AnnouncementCard'
import EmptyState from '../components/EmptyState'
import Reveal from '../components/Reveal'
import { useNotifications } from '../hooks/useNotifications'

export default function Announcements() {
  const { announcements, loading, error, markCategorySeen } = useNotifications()

  // Clears this category's notification badge the moment the visitor
  // actually looks at this page — see NotificationContext.jsx for why
  // that's the trigger instead of opening the bell dropdown.
  useEffect(() => {
    markCategorySeen('announcements')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const sorted = [...announcements].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-display text-3xl font-bold mb-2">Announcements</h1>
      <p className="text-muted-foreground max-w-2xl mb-6">
        Published updates and deadlines from the Placement Cell.
      </p>

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading announcements…</p>
      ) : error ? (
        <EmptyState title={error} />
      ) : sorted.length === 0 ? (
        <EmptyState title="No announcements available." />
      ) : (
        <Reveal stagger className="space-y-4">
          {sorted.map((a) => (
            <AnnouncementCard key={a.id} announcement={a} />
          ))}
        </Reveal>
      )}
    </div>
  )
}
