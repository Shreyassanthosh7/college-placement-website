import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** Animates a number counting up from 0 when scrolled into view. Non-numeric
 * values (e.g. "—" for an honest empty state) render as plain static text —
 * there's nothing to animate and nothing worth faking. */
export default function CountUp({ value, className = '' }) {
  const ref = useRef(null)
  const numeric = Number(value)
  const isNumeric = !Number.isNaN(numeric) && value !== ''

  useGSAP(
    () => {
      if (!isNumeric) return
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (prefersReduced) {
        ref.current.textContent = numeric
        return
      }
      const counter = { val: 0 }
      gsap.to(counter, {
        val: numeric,
        duration: 1.4,
        ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 90%', once: true },
        onUpdate: () => {
          ref.current.textContent = Math.round(counter.val)
        },
      })
    },
    { scope: ref, dependencies: [numeric, isNumeric] }
  )

  if (!isNumeric) return <span className={className}>{value}</span>
  return <span ref={ref} className={className}>0</span>
}
