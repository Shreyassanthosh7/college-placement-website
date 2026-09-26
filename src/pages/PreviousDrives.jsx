import { useEffect, useState } from 'react'
import DriveCard from '../components/DriveCard'
import EmptyState from '../components/EmptyState'
import Reveal from '../components/Reveal'
import { getCompletedDrives } from '../services/driveService'

export default function PreviousDrives() {
  const [drives, setDrives] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    getCompletedDrives()
      .then((data) => { if (!cancelled) setDrives(data) })
      .catch(() => { if (!cancelled) setError('Unable to load previous drives. Please try again later.') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-display text-3xl font-bold mb-2">Previous Placement Drives</h1>
      <p className="text-muted-foreground max-w-2xl mb-6">
        A record of completed placement drives.
      </p>

      {loading ? (
        <p className="text-muted-foreground text-sm">Loading drives…</p>
      ) : error ? (
        <EmptyState title={error} />
      ) : drives.length === 0 ? (
        <EmptyState title="No previous drives on record yet." />
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
