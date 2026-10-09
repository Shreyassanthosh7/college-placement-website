import { motion, useReducedMotion, useSpring } from 'framer-motion'
import { Link } from 'react-router-dom'
import { motionTransitions } from '../../lib/motion-tokens'

const MotionLink = motion.create(Link)

const variants = {
  primary: 'bg-primary text-primary-foreground shadow-sm hover:shadow-md',
  secondary: 'glass text-foreground hover:bg-card/80',
  outline: 'border border-primary/25 text-primary hover:bg-primary/5',
  ghost: 'text-primary hover:bg-primary/5',
}

/** A small magnetic pull for pointer devices, with a no-motion fallback. */
export default function MagneticButton({
  children,
  as = 'button',
  variant = 'primary',
  strength = 0.2,
  className = '',
  onPointerMove,
  onPointerLeave,
  type = 'button',
  ...props
}) {
  const prefersReducedMotion = useReducedMotion()
  const springX = useSpring(0, { stiffness: 280, damping: 22 })
  const springY = useSpring(0, { stiffness: 280, damping: 22 })
  const Element = as === 'link' ? MotionLink : as === 'a' ? motion.a : motion.button

  function handlePointerMove(event) {
    onPointerMove?.(event)
    if (prefersReducedMotion || event.pointerType === 'touch') return

    const bounds = event.currentTarget.getBoundingClientRect()
    springX.set((event.clientX - (bounds.left + bounds.width / 2)) * strength)
    springY.set((event.clientY - (bounds.top + bounds.height / 2)) * strength)
  }

  function handlePointerLeave(event) {
    onPointerLeave?.(event)
    springX.set(0)
    springY.set(0)
  }

  return (
    <Element
      {...props}
      type={as === 'button' ? type : undefined}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
      transition={motionTransitions.springSnappy}
      style={{ ...props.style, x: springX, y: springY }}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors duration-200 ${variants[variant] || variants.primary} ${className}`}
    >
      {children}
    </Element>
  )
}
