/**
 * Decorative animated background: two drifting light-blue/navy "aurora"
 * blobs plus a faint dot-grid, all behind a `pointer-events-none,
 * aria-hidden` layer so it never interferes with content or screen
 * readers. The drift animation itself is defined in index.css
 * (`.aurora-blob`) and already respects prefers-reduced-motion globally.
 */
export default function AuroraBackground({ className = '' }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      <div
        className="aurora-blob"
        style={{ width: 480, height: 480, top: -140, left: '5%', background: '#3B6EA5' }}
      />
      <div
        className="aurora-blob"
        style={{ width: 420, height: 420, top: 40, right: '0%', background: '#14263E', animationDelay: '-8s' }}
      />
      <svg className="absolute inset-0 w-full h-full opacity-[0.05]" aria-hidden="true">
        <defs>
          <pattern id="dot-grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-grid)" />
      </svg>
    </div>
  )
}
