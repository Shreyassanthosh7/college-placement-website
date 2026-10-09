import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle({ showLabel = false, className = '' }) {
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'
  const nextTheme = isDark ? 'light' : 'dark'
  const label = `Switch to ${nextTheme} mode`

  return (
    <button
      type="button"
      aria-label="Dark mode"
      aria-pressed={isDark}
      title={label}
      onClick={() => setTheme(nextTheme)}
      className={`inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-border bg-card px-3 text-foreground transition-colors hover:bg-muted focus-visible:outline focus-visible:outline-2 ${className}`}
    >
      {isDark ? (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" strokeLinecap="round" />
        </svg>
      ) : (
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
          <path d="M20.2 15.4A8.5 8.5 0 0 1 8.6 3.8 8.5 8.5 0 1 0 20.2 15.4Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {showLabel && <span className="text-sm font-medium">{isDark ? 'Light mode' : 'Dark mode'}</span>}
    </button>
  )
}
