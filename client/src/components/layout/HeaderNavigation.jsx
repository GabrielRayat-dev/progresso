import { useState, useRef, useEffect } from 'react'
import { navIcons } from '../../constants/navIcons'
import { useNotifications } from '../../context/NotificationsContext'

export default function HeaderNavigation({ isDarkMode, toggleTheme }) {
  const { notifications, unreadCount, markAllRead, markOneRead, dismissNotification, fetchNotifications } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const bellRef = useRef(null)
  const panelRef = useRef(null)

  // Re-sync the list whenever the panel opens (catches background changes)
  useEffect(() => {
    if (isOpen) fetchNotifications()
  }, [isOpen, fetchNotifications])

  // Close panel on click-away or Escape
  useEffect(() => {
    if (!isOpen) return

    const handleClick = (e) => {
      // Ignore clicks on the bell itself or inside the panel
      if (bellRef.current?.contains(e.target) || panelRef.current?.contains(e.target)) return
      setIsOpen(false)
    }
    const handleKey = (e) => {
      if (e.key === 'Escape') setIsOpen(false)
    }

    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [isOpen])

  const handleBellClick = () => {
    setIsOpen((prev) => !prev)
  }

  const modeIcon = isDarkMode ? navIcons.light : navIcons.dark

  return (
    <div className="relative flex items-center gap-4">
      {/* NOTIFICATION BELL */}
      <button
        ref={bellRef}
        onClick={handleBellClick}
        className="relative bg-transparent border-none p-0 m-0 cursor-pointer flex items-center justify-center transition-transform duration-70 active:scale-95 hover:scale-105"
        style={{ outline: 'none', boxShadow: 'none' }}
        aria-label="Notifications"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <img src={navIcons.bell} alt="" aria-hidden="true" className="w-6 h-6 pixel-img" />
        {/* Unread badge — uses the active accent color */}
        {unreadCount > 0 && (
          <span
            className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-primary border-2 border-border text-white text-[10px] font-pixel leading-none"
            aria-hidden="true"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* NOTIFICATION PANEL */}
      {isOpen && (
        <div
          ref={panelRef}
          className="absolute right-0 top-[125%] w-80 max-h-[400px] flex flex-col bg-surface border-[3px] border-border rounded-lg shadow-retro z-50 p-4"
          role="dialog"
          aria-label="Notification panel"
        >
          {/* Header: title + Mark all as read */}
          <div className="flex items-center justify-between gap-2 pb-3 border-b-2 border-border">
            <div className="flex items-center gap-2 min-w-0">
              <img src={navIcons.bell} alt="" className="w-5 h-5 pixel-img shrink-0" />
              <p className="text-sm font-pixel text-textprimary truncate">
                {unreadCount > 0 ? `${unreadCount} unread` : 'Notifications'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="shrink-0 font-pixel text-[10px] uppercase tracking-wide text-primary border-[2px] border-transparent hover:border-primary hover:bg-primary/10 px-2 py-1 transition-colors cursor-pointer"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Scrollable list — fills the remaining height of the panel */}
          <div className="notif-scroll flex-1 overflow-y-auto mt-3">
            {notifications.length > 0 ? (
              <ul className="space-y-2">
                {notifications.map((n) => (
                  <li
                    key={n.id}
                    role="button"
                    tabIndex={n.is_read ? -1 : 0}
                    aria-label={n.is_read ? 'Notification read' : 'Mark notification as read'}
                    onClick={() => !n.is_read && markOneRead(n.id)}
                    onKeyDown={(e) => {
                      if (!n.is_read && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault()
                        markOneRead(n.id)
                      }
                    }}
                    className={`group flex items-start gap-2 rounded-md p-2 border-[2px] border-transparent transition-colors ${
                      n.is_read
                        ? 'bg-transparent cursor-default'
                        : 'bg-primary/10 hover:bg-primary/20 cursor-pointer'
                    }`}
                  >
                    <span
                      className={`mt-0.5 text-xs font-pixel leading-none ${
                        n.is_read ? 'text-textsecondary' : 'text-primary'
                      }`}
                    >
                      •
                    </span>
                    <span className="flex-1 font-mono text-sm text-textsecondary break-words">
                      {n.message}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        dismissNotification(n.id)
                      }}
                      aria-label="Dismiss notification"
                      className="shrink-0 w-5 h-5 flex items-center justify-center font-pixel text-sm leading-none text-textsecondary rounded hover:text-danger hover:bg-danger/10 cursor-pointer transition-colors"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-8 text-center text-sm text-textsecondary font-mono">No notifications yet</p>
            )}
          </div>
        </div>
      )}

      {/* THEME TOGGLE */}
      <button
        onClick={toggleTheme}
        className="bg-transparent border-none p-0 m-0 cursor-pointer flex items-center justify-center transition-transform duration-70 active:scale-95 hover:scale-105"
        style={{ outline: 'none', boxShadow: 'none' }}
        aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <img src={modeIcon} alt="" aria-hidden="true" className="w-6 h-6 pixel-img" />
      </button>
    </div>
  )
}
