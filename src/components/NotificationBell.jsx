import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { NotificationBell as EasyUINotificationBell } from './ui/notification-bell'
import { useNotifications } from '../hooks/useNotifications'

/**
 * Shows the actual new records from each live Firestore subscription.
 * Opening the bell stays read-only; visiting the linked section marks that
 * section as seen through its existing page-level markCategorySeen call.
 */
export default function NotificationBell() {
  const { newItems, loading } = useNotifications()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)

  const notifications = useMemo(() => {
    const groups = [
      {
        category: 'companies',
        to: '/companies',
        items: newItems.companies,
        message: (item) => `${item.name || 'A company'} posted a placement opportunity`,
      },
      {
        category: 'drives',
        to: '/drives',
        items: newItems.drives,
        message: (item) => `${item.companyName || item.company || item.name || 'A company'} scheduled a placement drive`,
      },
      {
        category: 'announcements',
        to: '/announcements',
        items: newItems.announcements,
        message: (item) => item.title || item.name || 'A new announcement was published',
      },
    ]

    return groups.flatMap(({ category, to, items, message }) =>
      items.map((item) => ({
        id: `${category}:${item.id}`,
        category,
        to,
        message: message(item),
        timestamp: item.createdAt?.toDate?.().toLocaleDateString() || 'Just added',
        read: false,
      }))
    )
  }, [newItems])

  useEffect(() => {
    if (!open) return
    function onClickOutside(event) {
      if (panelRef.current && !panelRef.current.contains(event.target)) setOpen(false)
    }
    function onKeyDown(event) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  function handleNotificationClick(notification) {
    setOpen(false)
    navigate(notification.to)
  }

  if (loading) return null

  return (
    <div className="relative" ref={panelRef}>
      <EasyUINotificationBell
        notifications={notifications}
        isOpen={open}
        onOpenChange={setOpen}
        onNotificationClick={handleNotificationClick}
        className="align-middle"
      />
    </div>
  )
}
