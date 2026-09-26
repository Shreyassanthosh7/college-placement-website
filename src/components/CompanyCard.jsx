import { Link } from 'react-router-dom'
import Badge from './Badge'
import { formatDate } from '../utils/formatDate'

export default function CompanyCard({ company }) {
  return (
    <div className="flex flex-col glass glow-on-hover rounded-xl p-5 transition-transform duration-200 hover:-translate-y-1">
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-11 h-11 rounded-md flex items-center justify-center text-white font-bold shrink-0 ring-1"
          style={{ backgroundColor: company.logoColor || 'var(--color-primary)', '--tw-ring-color': 'var(--color-border)' }}
          aria-hidden="true"
        >
          {company.logoInitials || company.logoInitial}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display font-semibold leading-tight truncate">{company.name}</p>
          <p className="text-sm text-muted-foreground truncate">{company.role}</p>
        </div>
        <Badge status={company.status} />
      </div>

      <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm mb-4">
        <div>
          <dt className="text-xs text-muted-foreground">Package</dt>
          <dd className="font-medium truncate">{company.package}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Location</dt>
          <dd className="font-medium truncate">{company.location}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Drive date</dt>
          <dd className="font-medium">{formatDate(company.driveDate)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Apply by</dt>
          <dd className="font-medium">{formatDate(company.applicationDeadline)}</dd>
        </div>
      </dl>

      <Link
        to={`/companies/${company.id}`}
        className="btn-outline-gold mt-auto text-center px-4 py-2.5 rounded-full text-sm font-semibold cursor-pointer"
      >
        View Details
      </Link>
    </div>
  )
}
