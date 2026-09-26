import Badge from './Badge'
import { formatDate, formatTime } from '../utils/formatDate'

export default function DriveCard({ drive }) {
  return (
    <div className="glass glow-on-hover rounded-xl p-5 transition-transform duration-200 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <p className="font-display font-semibold">{drive.companyName}</p>
          <p className="text-sm text-muted-foreground">{drive.role}</p>
        </div>
        <Badge status={drive.status} />
      </div>
      <dl className="grid grid-cols-3 gap-3 text-sm mt-4 mb-3">
        <div>
          <dt className="text-xs text-muted-foreground">Date</dt>
          <dd className="font-medium">{formatDate(drive.date)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Time</dt>
          <dd className="font-medium">{formatTime(drive.time)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Venue</dt>
          <dd className="font-medium truncate">{drive.venue}</dd>
        </div>
      </dl>
      {drive.description && <p className="text-sm text-muted-foreground mb-1">{drive.description}</p>}
      {drive.instructions && (
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Instructions: </span>
          {drive.instructions}
        </p>
      )}
    </div>
  )
}
