import { useSettings } from '../hooks/useSettings'
import Reveal from '../components/Reveal'

export default function Contact() {
  const { settings } = useSettings()

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
          <a href={`mailto:${settings.email}`} className="font-medium hover:underline" style={{ color: 'var(--color-primary)' }}>
            {settings.email}
          </a>
        </div>
        <div className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Phone</p>
          <p className="font-medium">{settings.phone}</p>
        </div>
        <div className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Address</p>
          <p className="font-medium">{settings.address}</p>
          <p className="font-medium mt-1">{settings.secondAddress}</p>
        </div>
        <div className="p-5">
          <p className="text-xs text-muted-foreground mb-1">Office Hours</p>
          <p className="font-medium">{settings.officeHours}</p>
        </div>
        <div className="p-5">
          <p className="text-xs text-muted-foreground mb-2">Connect</p>
          <div className="flex flex-wrap gap-3 text-sm">
            <a href={settings.social.youtube} target="_blank" rel="noopener noreferrer" className="hover:underline transition-colors duration-200" style={{ color: 'var(--color-primary)' }}>YouTube</a>
            <a href={settings.social.twitter} target="_blank" rel="noopener noreferrer" className="hover:underline transition-colors duration-200" style={{ color: 'var(--color-primary)' }}>Twitter / X</a>
            <a href={settings.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:underline transition-colors duration-200" style={{ color: 'var(--color-primary)' }}>Instagram</a>
            <a href={settings.collegeWebsite} target="_blank" rel="noopener noreferrer" className="hover:underline transition-colors duration-200" style={{ color: 'var(--color-primary)' }}>College Website</a>
          </div>
        </div>
      </div>
      </Reveal>
    </div>
  )
}
