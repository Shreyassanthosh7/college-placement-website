import { useSettings } from '../hooks/useSettings'

export default function Footer() {
  const { settings } = useSettings()

  return (
    <footer className="relative bg-card mt-16">
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, var(--color-primary), transparent)' }}
        aria-hidden="true"
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 sm:grid-cols-4 gap-8 text-sm">
        <div>
          <p className="font-display font-semibold text-base mb-2">{settings.placementCellName}</p>
          <p className="text-muted-foreground">{settings.collegeName}</p>
        </div>
        <div>
          <p className="font-semibold mb-2">Campus</p>
          <p className="text-muted-foreground whitespace-pre-line">{settings.address}</p>
        </div>
        <div>
          <p className="font-semibold mb-2">Contact</p>
          <p className="text-muted-foreground">
            <a href={`mailto:${settings.email}`} className="hover:text-primary">{settings.email}</a>
          </p>
          <p className="text-muted-foreground">{settings.phone}</p>
        </div>
        <div>
          <p className="font-semibold mb-2">Connect</p>
          <ul className="space-y-1">
            <li><a href={settings.social.youtube} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors duration-200">YouTube</a></li>
            <li><a href={settings.social.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors duration-200">Twitter / X</a></li>
            <li><a href={settings.social.instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors duration-200">Instagram</a></li>
            <li><a href={settings.collegeWebsite} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors duration-200">College Website</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 text-xs text-muted-foreground">
          <p>{settings.footerText}</p>
        </div>
      </div>
    </footer>
  )
}
