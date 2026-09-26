import { useEffect } from 'react'
import DriveCard from '../components/DriveCard'
import EmptyState from '../components/EmptyState'
import Reveal from '../components/Reveal'
import { useNotifications } from '../hooks/useNotifications'

export default function Drives() {
  const { drives, loading, error, markCategorySeen } = useNotifications()

  // Clears this category's notification badge the moment the visitor
  // actually looks at this page — see NotificationContext.jsx for why
  // that's the trigger instead of opening the bell dropdown.
  useEffect(() => {
    markCategorySeen('drives')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-display text-3xl font-bold mb-2">Upcoming Placement Drives</h1>
      <p className="text-muted-foreground max-w-2xl mb-6">
        Scheduled campus recruitment drives, with date, time, and venue.
      </p>

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading drives…</p>
      ) : error ? (
        <EmptyState title={error} />
      ) : drives.length === 0 ? (
        <EmptyState title="No upcoming drives scheduled." description="Please check again later." />
      ) : (
        <Reveal stagger className="space-y-4">
          {drives.map((d) => (
            <DriveCard key={d.id} drive={d} />
          ))}
        </Reveal>
      )}
    </div>
  )
}
