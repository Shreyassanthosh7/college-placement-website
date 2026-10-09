import { motion, useMotionTemplate, useMotionValue, useReducedMotion } from 'framer-motion'

/** A glass card with a restrained pointer-following light in the site palette. */
export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(59, 110, 165, 0.13)',
  spotlightSize = 340,
  ...props
}) {
  const prefersReducedMotion = useReducedMotion()
  const mouseX = useMotionValue(-1000)
  const mouseY = useMotionValue(-1000)
  const background = useMotionTemplate`radial-gradient(${spotlightSize}px circle at ${mouseX}px ${mouseY}px, ${spotlightColor}, transparent 78%)`

  function handlePointerMove(event) {
    if (prefersReducedMotion || event.pointerType === 'touch') return
    const bounds = event.currentTarget.getBoundingClientRect()
    mouseX.set(event.clientX - bounds.left)
    mouseY.set(event.clientY - bounds.top)
  }

  function handlePointerLeave() {
    mouseX.set(-1000)
    mouseY.set(-1000)
  }

  return (
    <div
      {...props}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`group relative isolate overflow-hidden rounded-2xl border border-border bg-card/90 shadow-[0_18px_48px_-30px_rgba(20,38,62,0.36)] ${className}`}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
