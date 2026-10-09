import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useId, useRef, useState } from 'react'
import { motionTransitions } from '../../lib/motion-tokens'

/** Animated, keyboard-accessible tabs with a shared sliding active indicator. */
export default function AnimatedTabs({
  tabs,
  defaultTab,
  activeTab: controlledTab,
  onChange,
  className = '',
  tabsContainerClassName = '',
  accessibleLabel = 'Content sections',
  variant = 'default',
  renderContent = true,
}) {
  const uniqueId = useId()
  const tabRefs = useRef([])
  const [internalTab, setInternalTab] = useState(defaultTab || tabs[0]?.id || '')
  const prefersReducedMotion = useReducedMotion()
  const requestedTab = controlledTab === undefined ? internalTab : controlledTab
  const currentTab = tabs.find((tab) => tab.id === requestedTab) || tabs[0]
  const activeTab = currentTab?.id
  const isPill = variant === 'glass' || variant === 'pill'

  function selectTab(id) {
    if (controlledTab === undefined) setInternalTab(id)
    onChange?.(id)
  }

  function handleKeyDown(event, index) {
    let nextIndex
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = tabs.length - 1
    if (nextIndex === undefined) return

    event.preventDefault()
    tabRefs.current[nextIndex]?.focus()
    selectTab(tabs[nextIndex].id)
  }

  if (!currentTab) return null

  return (
    <div className={`flex flex-col gap-5 ${className}`}>
      <div
        role="tablist"
        aria-label={accessibleLabel}
        className={`flex w-full items-center gap-1 overflow-x-auto rounded-full border border-border bg-card/55 p-1.5 sm:w-fit ${isPill ? 'backdrop-blur-xl' : ''} ${tabsContainerClassName}`}
      >
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id
          const tabId = `${uniqueId}-tab-${tab.id}`
          const panelId = `${uniqueId}-panel-${tab.id}`
          return (
            <button
              key={tab.id}
              ref={(element) => { tabRefs.current[index] = element }}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={panelId}
              tabIndex={isActive ? 0 : -1}
              onClick={() => selectTab(tab.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className={`relative flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {isActive && (
                <motion.span
                  aria-hidden="true"
                  layoutId={`${uniqueId}-active-indicator`}
                  transition={prefersReducedMotion ? { duration: 0 } : motionTransitions.springSnappy}
                  className="absolute inset-0 rounded-full border border-primary/10 bg-card shadow-sm"
                />
              )}
              <span className="relative z-10">{tab.label}</span>
              {tab.badge !== undefined && tab.badge !== null && (
                <span className={`relative z-10 rounded-full px-2 py-0.5 text-xs tabular-nums ${isActive ? 'bg-primary/8 text-primary' : 'bg-muted text-muted-foreground'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {renderContent && (
        <div
          id={`${uniqueId}-panel-${currentTab.id}`}
          role="tabpanel"
          aria-labelledby={`${uniqueId}-tab-${currentTab.id}`}
          tabIndex={0}
          className="min-h-40 outline-none focus-visible:rounded-xl"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentTab.id}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -5 }}
              transition={prefersReducedMotion ? { duration: 0 } : motionTransitions.springGentle}
            >
              {currentTab.content}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
