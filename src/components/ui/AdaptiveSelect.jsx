import { useEffect, useId, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'

/**
 * Theme-aware select menu with native select-style keyboard interaction.
 * `options` is an array of { value, label } items; `onChange` receives a value.
 */
export default function AdaptiveSelect({
  id,
  options,
  value,
  onChange,
  className = '',
  containerClassName = 'relative inline-flex',
  ariaLabel,
  ariaLabelledBy,
  disabled = false,
  placeholder = 'Select an option',
}) {
  const generatedId = useId()
  const controlId = id || `adaptive-select-${generatedId}`
  const listboxId = `${controlId}-listbox`
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const typeaheadRef = useRef('')
  const typeaheadTimerRef = useRef(null)
  const selectedIndex = options.findIndex((option) => option.value === value)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(Math.max(selectedIndex, 0))
  const selectedOption = options[selectedIndex]

  useEffect(() => {
    if (!open) return undefined

    function closeWhenOutside(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }

    document.addEventListener('pointerdown', closeWhenOutside)
    return () => document.removeEventListener('pointerdown', closeWhenOutside)
  }, [open])

  useEffect(() => {
    if (!open) return
    document.getElementById(`${controlId}-option-${activeIndex}`)?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, controlId, open])

  useEffect(() => () => window.clearTimeout(typeaheadTimerRef.current), [])

  function openMenu(index = selectedIndex >= 0 ? selectedIndex : 0) {
    if (options.length === 0) return
    setActiveIndex(Math.max(0, Math.min(index, options.length - 1)))
    setOpen(true)
  }

  function chooseOption(option) {
    onChange(option.value)
    setOpen(false)
    triggerRef.current?.focus()
  }

  function handleKeyDown(event) {
    if (disabled) return

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const direction = event.key === 'ArrowDown' ? 1 : -1
      if (!open) {
        openMenu()
      } else {
        setActiveIndex((index) => (index + direction + options.length) % options.length)
      }
      return
    }

    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      if (!open) setOpen(true)
      setActiveIndex(event.key === 'Home' ? 0 : options.length - 1)
      return
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (!open) {
        openMenu()
      } else if (options[activeIndex]) {
        chooseOption(options[activeIndex])
      }
      return
    }

    if (event.key === 'Escape') {
      if (open) {
        event.preventDefault()
        setOpen(false)
      }
      return
    }

    if (event.key === 'Tab') {
      setOpen(false)
      return
    }

    if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
      const search = `${typeaheadRef.current}${event.key}`.toLowerCase()
      typeaheadRef.current = search
      window.clearTimeout(typeaheadTimerRef.current)
      typeaheadTimerRef.current = window.setTimeout(() => { typeaheadRef.current = '' }, 700)
      const start = open ? activeIndex + 1 : Math.max(selectedIndex, -1) + 1
      const orderedOptions = [...options.slice(start), ...options.slice(0, start)]
      const match = orderedOptions.find((option) => String(option.label).toLowerCase().startsWith(search))
      if (match) {
        const index = options.indexOf(match)
        setActiveIndex(index)
        setOpen(true)
      }
    }
  }

  return (
    <div ref={rootRef} className={containerClassName}>
      <button
        ref={triggerRef}
        id={controlId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={open ? `${controlId}-option-${activeIndex}` : undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        disabled={disabled}
        className={`${className} flex items-center justify-between gap-3 text-left disabled:cursor-not-allowed disabled:opacity-60`}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={handleKeyDown}
      >
        <span className="truncate">{selectedOption?.label ?? placeholder}</span>
        <ChevronDown aria-hidden="true" className={`size-4 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          id={listboxId}
          role="listbox"
          aria-labelledby={ariaLabelledBy}
          className="absolute left-0 top-[calc(100%+0.5rem)] z-50 max-h-64 min-w-full w-max max-w-[min(24rem,calc(100vw-2rem))] overflow-y-auto rounded-xl border border-border bg-card p-1.5 text-card-foreground shadow-xl shadow-black/15"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value
            const isActive = index === activeIndex

            return (
              <div
                key={option.value}
                id={`${controlId}-option-${index}`}
                role="option"
                aria-selected={isSelected}
                className={`flex min-h-10 items-center justify-between gap-4 rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive ? 'bg-muted text-foreground' : 'text-card-foreground'
                } ${isSelected ? 'font-semibold' : ''}`}
                onMouseMove={() => setActiveIndex(index)}
                onClick={() => chooseOption(option)}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && <Check aria-hidden="true" className="size-4 shrink-0 text-primary" />}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
