import { useEffect, useRef } from 'react'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

export default function AccessibleDialog({
  children,
  onClose,
  labelledBy,
  describedBy,
  initialFocusRef,
  fallbackFocusRef,
  closeOnEscape = true,
  closeOnBackdrop = true,
  className = 'glass rounded-xl p-6 max-w-lg w-full',
}) {
  const dialogRef = useRef(null)
  const closeRef = useRef(onClose)
  const closeOnEscapeRef = useRef(closeOnEscape)

  useEffect(() => {
    closeRef.current = onClose
  }, [onClose])

  useEffect(() => {
    closeOnEscapeRef.current = closeOnEscape
  }, [closeOnEscape])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return undefined

    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusable = () => Array.from(dialog.querySelectorAll(FOCUSABLE_SELECTOR))
      .filter((element) => element.getClientRects().length > 0)
    const firstTarget = initialFocusRef?.current || focusable()[0] || dialog
    const frame = window.requestAnimationFrame(() => firstTarget.focus())

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        if (closeOnEscapeRef.current) closeRef.current?.()
        return
      }
      if (event.key !== 'Tab') return

      const elements = focusable()
      if (elements.length === 0) {
        event.preventDefault()
        dialog.focus()
        return
      }

      const first = elements[0]
      const last = elements[elements.length - 1]
      if (!dialog.contains(document.activeElement)) {
        event.preventDefault()
        ;(event.shiftKey ? last : first).focus()
        return
      }
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      window.cancelAnimationFrame(frame)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow

      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true })
      } else if (fallbackFocusRef?.current) {
        fallbackFocusRef.current.focus({ preventScroll: true })
      }
    }
  }, [initialFocusRef, fallbackFocusRef])

  function handleBackdropMouseDown(event) {
    if (closeOnBackdrop && event.target === event.currentTarget) closeRef.current?.()
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4"
      onMouseDown={handleBackdropMouseDown}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        tabIndex={-1}
        className={`${className} max-h-[calc(100dvh-2rem)] overflow-y-auto`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}
