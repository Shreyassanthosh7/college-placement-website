import { useSettings } from '../hooks/useSettings'

export default function Footer() {
  const { settings } = useSettings()
  const placementCellName = settings.placementCellName?.trim() || 'Placement Cell'
  const collegeName = settings.collegeName?.trim()
  const email = settings.email?.trim()
  const phone = settings.phone?.trim()
  const socialLinks = [
    { label: 'YouTube', href: settings.social.youtube },
    { label: 'Twitter / X', href: settings.social.twitter },
    { label: 'Instagram', href: settings.social.instagram },
    { label: 'College Website', href: settings.collegeWebsite },
  ].filter((link) => link.href?.trim())

  return (
    <footer className="relative bg-card mt-16">
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--color-primary), transparent)' }}
        aria-hidden="true"
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 sm:grid-cols-4 gap-8 text-sm">
        <div>
          <p className="font-display font-semibold text-base mb-2">{placementCellName}</p>
          {collegeName && <p className="text-muted-foreground">{collegeName}</p>}
        </div>
        {settings.address?.trim() && <div>
          <p className="font-semibold mb-2">Campus</p>
          <p className="text-muted-foreground whitespace-pre-line">{settings.address}</p>
        </div>}
        {(email || phone) && <div>
          <p className="font-semibold mb-2">Contact</p>
          {email && <p className="text-muted-foreground"><a href={`mailto:${email}`} className="hover:text-primary">{email}</a></p>}
          {phone && <p className="text-muted-foreground">{phone}</p>}
        </div>}
        {socialLinks.length > 0 && <div>
          <p className="font-semibold mb-2">Connect</p>
          <ul className="space-y-1">
            {socialLinks.map((link) => <li key={link.label}><a href={link.href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors duration-200">{link.label}</a></li>)}
          </ul>
        </div>}
      </div>
      {settings.footerText?.trim() && <div className="border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 text-xs text-muted-foreground">
          <p>{settings.footerText}</p>
        </div>
      </div>}
    </footer>
  )
}
