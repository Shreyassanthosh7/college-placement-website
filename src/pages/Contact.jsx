import { useSettings } from '../hooks/useSettings'
import Reveal from '../components/Reveal'

export default function Contact() {
  const { settings } = useSettings()
  const phoneHref = settings.phone ? `tel:${settings.phone.replace(/[^+\d]/g, '')}` : null
  const primaryDirections = settings.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`
    : null
  const secondaryDirections = settings.secondAddress
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.secondAddress)}`
    : null
  const actionClass = 'inline-flex min-h-11 items-center justify-center rounded-full border px-4 text-sm font-semibold transition-colors hover:bg-white/40 focus-visible:outline focus-visible:outline-2'

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <Reveal>
      <h1 className="font-display text-3xl font-bold mb-2">Contact Placement Cell</h1>
      <p className="text-muted-foreground max-w-2xl mb-8">
        Reach out to the Placement Cell for placement-related queries.
      </p>

      <div className="glass rounded-xl divide-y divide-border">
        <div className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Placement Cell</p>
          <p className="font-medium">{settings.placementCellName}</p>
          <p className="text-sm text-muted-foreground">{settings.collegeName}</p>
        </div>
        <div className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Email</p>
            <a href={`mailto:${settings.email}`} className="inline-flex min-h-11 items-center hover:underline focus-visible:outline focus-visible:outline-2" style={{ color: 'var(--color-primary)' }}>
            {settings.email}
          </a>
          <div className="mt-3">
            <a href={`mailto:${settings.email}`} className={actionClass} style={{ borderColor: 'var(--color-border)', color: 'var(--color-primary)' }}>
              Email the Placement Cell
            </a>
          </div>
        </div>
        <div className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Phone</p>
          {phoneHref ? (
            <a href={phoneHref} className="inline-flex min-h-11 items-center hover:underline focus-visible:outline focus-visible:outline-2" style={{ color: 'var(--color-primary)' }}>{settings.phone}</a>
          ) : (
            <p className="font-medium">{settings.phone}</p>
          )}
          {phoneHref && (
            <div className="mt-3">
              <a href={phoneHref} className={actionClass} style={{ borderColor: 'var(--color-border)', color: 'var(--color-primary)' }}>
                Call the Placement Cell
              </a>
            </div>
          )}
        </div>
        <div className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Address</p>
          <p className="font-medium">{settings.address}</p>
          {primaryDirections && (
            <a href={primaryDirections} target="_blank" rel="noopener noreferrer" className={`${actionClass} mt-3`} style={{ borderColor: 'var(--color-border)', color: 'var(--color-primary)' }}>
              Directions to primary campus
            </a>
          )}
          {settings.secondAddress && <p className="font-medium mt-4">{settings.secondAddress}</p>}
          {secondaryDirections && (
            <a href={secondaryDirections} target="_blank" rel="noopener noreferrer" className={`${actionClass} mt-3`} style={{ borderColor: 'var(--color-border)', color: 'var(--color-primary)' }}>
              Directions to second campus
            </a>
          )}
        </div>
        <div className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Office Hours</p>
          <p className="font-medium">{settings.officeHours}</p>
        </div>
        <div className="p-5">
          <p className="text-xs text-muted-foreground mb-2">Connect</p>
          <div className="flex flex-wrap gap-3 text-sm">
            <a href={settings.social.youtube} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center px-2 hover:underline transition-colors duration-200 focus-visible:outline focus-visible:outline-2" style={{ color: 'var(--color-primary)' }}>YouTube</a>
            <a href={settings.social.twitter} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center px-2 hover:underline transition-colors duration-200 focus-visible:outline focus-visible:outline-2" style={{ color: 'var(--color-primary)' }}>Twitter / X</a>
            <a href={settings.social.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center px-2 hover:underline transition-colors duration-200 focus-visible:outline focus-visible:outline-2" style={{ color: 'var(--color-primary)' }}>Instagram</a>
            <a href={settings.collegeWebsite} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center px-2 hover:underline transition-colors duration-200 focus-visible:outline focus-visible:outline-2" style={{ color: 'var(--color-primary)' }}>College Website</a>
          </div>
        </div>
      </div>
      </Reveal>
    </div>
  )
}
