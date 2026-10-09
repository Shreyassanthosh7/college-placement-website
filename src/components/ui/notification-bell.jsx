'use client';;
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motionTransitions } from '../../lib/motion-tokens';

export const NotificationBell = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onNotificationClick,
  isOpen: controlledIsOpen,
  onOpenChange,
  showCount = true,
  className,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const containerRef = useRef(null);

  const isPanelOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setPanelOpen = useCallback(
    (open) => {
      if (onOpenChange) onOpenChange(open);
      else setInternalIsOpen(open);
    },
    [onOpenChange]
  );

  const unreadCount = notifications.filter((n) => !n.read).length;
  const prevCountRef = useRef(unreadCount);

  // Trigger subtle bell shake when new unread notifications arrive
  useEffect(() => {
    if (unreadCount > prevCountRef.current) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 600);
      return () => clearTimeout(timer);
    }
    prevCountRef.current = unreadCount;
  }, [unreadCount]);

  // Click outside to close panel
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setPanelOpen(false);
      }
    };
    if (isPanelOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      return () => document.removeEventListener('mousedown', handleOutsideClick);
    }
  }, [isPanelOpen, setPanelOpen]);

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      {/* Bell Trigger Button */}
      <motion.button
        type="button"
        onClick={() => setPanelOpen(!isPanelOpen)}
        animate={
          isShaking
            ? {
                rotate: [0, -12, 10, -8, 6, -2, 0],
              }
            : {}
        }
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-expanded={isPanelOpen}
        aria-label={
          unreadCount > 0
            ? `${unreadCount} unread notifications`
            : 'Notifications'
        }
        className={cn(
          'relative cursor-pointer rounded-full border p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          isPanelOpen
            ? 'border-border bg-muted text-foreground'
            : 'border-transparent bg-transparent text-foreground hover:border-border hover:bg-foreground/5'
        )}
      >
        <Bell className="w-5 h-5" />

        {/* Unread Badge / Red Dot */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={motionTransitions.springSnappy}
              className={cn(
                'absolute -right-1 -top-1 flex items-center justify-center rounded-full border-2 border-card bg-rose-500 font-mono font-bold text-white',
                showCount
                  ? 'min-w-[18px] h-[18px] px-1 text-[9px]'
                  : 'w-2.5 h-2.5'
              )}
            >
              {showCount && (unreadCount > 99 ? '99+' : unreadCount)}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Floating Notification Panel */}
      <AnimatePresence>
        {isPanelOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={motionTransitions.springSnappy}
            className="glass absolute left-1/2 z-50 mt-2 w-[calc(100vw-4rem)] max-w-[320px] -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-card/95 text-card-foreground shadow-xl backdrop-blur-xl sm:left-auto sm:right-0 sm:max-w-none sm:translate-x-0 sm:w-96"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border bg-muted/60 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-foreground">Notifications</span>
                {unreadCount > 0 && (
                  <span className="rounded-full border border-primary/20 bg-primary/10 px-1.5 py-0.5 text-[10px] font-mono text-primary">
                    {unreadCount} new
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                {unreadCount > 0 && onMarkAllAsRead && (
                  <button
                    type="button"
                    onClick={onMarkAllAsRead}
                    className="flex cursor-pointer items-center gap-1 rounded-lg p-1 text-[10px] text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                    title="Mark all as read"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Read all</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setPanelOpen(false)}
                  className="cursor-pointer rounded-lg p-1 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                  aria-label="Close notifications"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="max-h-80 divide-y divide-border overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-8 px-4 text-center">
                  <Bell className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">No notifications right now</p>
                </div>
              ) : (
                notifications.map((item) => {
                  const dateString =
                    typeof item.timestamp === 'string'
                      ? item.timestamp
                      : item.timestamp.toLocaleDateString();

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      role={onNotificationClick ? 'button' : undefined}
                      tabIndex={onNotificationClick ? 0 : undefined}
                      onClick={() => onNotificationClick?.(item)}
                      onKeyDown={(event) => {
                        if (onNotificationClick && (event.key === 'Enter' || event.key === ' ')) {
                          event.preventDefault()
                          onNotificationClick(item)
                        }
                      }}
                      className={cn(
                        'flex items-start gap-3 p-3 transition-colors',
                        onNotificationClick && 'cursor-pointer hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
                        !item.read && 'bg-primary/[0.04]'
                      )}
                    >
                      <span
                        className={cn(
                          'w-2 h-2 rounded-full mt-1.5 shrink-0',
                          item.read ? 'bg-transparent' : 'animate-pulse bg-rose-500'
                        )}
                      />

                      <div className="flex-1 min-w-0">
                        <p className={cn('text-xs leading-relaxed text-muted-foreground', !item.read && 'font-medium text-foreground')}>
                          {item.message}
                        </p>
                        <span className="mt-1 block text-[10px] font-mono text-muted-foreground">
                          {dateString}
                        </span>
                      </div>

                      {!item.read && onMarkAsRead && (
                        <button
                          type="button"
                          onClick={() => onMarkAsRead(item.id)}
                          className="shrink-0 cursor-pointer rounded p-1 text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                          title="Mark as read"
                          aria-label="Mark notification as read"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
