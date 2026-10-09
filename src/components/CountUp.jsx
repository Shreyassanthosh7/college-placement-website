import { useEffect, useRef, useState } from 'react'

/** Animates live numeric changes from the value currently on screen. */
export default function CountUp({ value, className = '' }) {
  const numeric = Number(value)
  const isNumeric = !Number.isNaN(numeric) && value !== '' && value !== null && value !== undefined
  const [displayedValue, setDisplayedValue] = useState(0)
  const displayedRef = useRef(0)

  useEffect(() => {
    if (!isNumeric) return undefined

    const target = numeric
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      displayedRef.current = target
      setDisplayedValue(target)
      return undefined
    }

    const startValue = displayedRef.current
    if (startValue === target) return undefined

    const startTime = performance.now()
    const duration = startValue === 0 ? 900 : 550
    let frameId

    function animate(now) {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const nextValue = Math.round(startValue + (target - startValue) * eased)
      displayedRef.current = nextValue
      setDisplayedValue(nextValue)

      if (progress < 1) frameId = window.requestAnimationFrame(animate)
      else displayedRef.current = target
    }

    frameId = window.requestAnimationFrame(animate)
    return () => window.cancelAnimationFrame(frameId)
  }, [numeric, isNumeric])

  if (!isNumeric) return <span className={className}>{value}</span>
  return <span className={className}>{displayedValue}</span>
}
