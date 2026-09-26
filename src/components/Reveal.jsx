import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Wraps children in a fade-up reveal that plays once when scrolled into
 * view. `stagger` animates direct children individually (for grids of
 * cards) instead of animating the wrapper as one block.
 *
 * Respects prefers-reduced-motion by rendering the final state immediately
 * with no animation — per the design-system checklist's accessibility
 * requirement, not just a performance nicety.
 */
export default function Reveal({ children, className = '', stagger = false, delay = 0, as: Tag = 'div' }) {
  const ref = useRef(null)

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const targets = stagger ? gsap.utils.toArray(ref.current.children) : ref.current

      if (prefersReduced) {
        gsap.set(targets, { opacity: 1, y: 0 })
        return
      }

      gsap.set(targets, { opacity: 0, y: 24 })
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay,
        ease: 'power3.out',
        stagger: stagger ? 0.1 : 0,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 88%',
          once: true,
        },
      })
    },
    { scope: ref }
  )

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
