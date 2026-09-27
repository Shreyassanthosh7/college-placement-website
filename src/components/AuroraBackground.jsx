/** Static background treatment for standalone auth pages. Keep the layers
 * positioned here instead of relying on animation CSS so they can never
 * render as large unpositioned color blocks. */
export default function AuroraBackground({ className = '' }) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-br from-[#DDECF9] via-[#C6DEF4] to-[#B3D2EA]" />
      <svg className="absolute inset-0 w-full h-full opacity-[0.05]" aria-hidden="true">
        <defs>
          <pattern id="dot-grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="#14263E" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-grid)" />
      </svg>
    </div>
  )
}
