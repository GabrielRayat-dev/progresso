import { useState, useRef, useEffect } from 'react'
import { navIcons } from '../../constants/navIcons'
import { useNotifications } from '../../context/NotificationsContext'

export default function HeaderNavigation({ isDarkMode, toggleTheme }) {
  const { notifications, unreadCount, markAllRead, fetchNotifications } = useNotifications()
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
    const next = !isOpen
    setIsOpen(next)
    if (next && unreadCount > 0) {
      // Opening the panel: mark everything read and clear the purple dot
      markAllRead()
    }
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
        {/* Purple unread badge */}
        {unreadCount > 0 && (
          <span
            className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-[#8B5CF6] border-2 border-border text-white text-[10px] font-pixel leading-none"
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
          className="absolute right-0 top-[125%] bg-surface border-[3px] border-border rounded-lg shadow-retro z-50 min-w-50 p-4"
          role="dialog"
          aria-label="Notification panel"
        >
          <div className="flex items-start gap-3">
            <img src={navIcons.bell} alt="" className="w-5 h-5 pixel-img shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-pixel text-textprimary">
                {unreadCount > 0 ? `You have ${unreadCount} new` : 'Notifications'}
              </p>

              {notifications.length > 0 ? (
                <ul className="mt-2 space-y-1 text-sm text-textsecondary max-h-64 overflow-y-auto border-t-2 border-border pt-2">
                  {notifications.map((n) => (
                    <li
                      key={n.id}
                      className={`flex items-start gap-2 ${n.is_read ? 'opacity-60' : ''}`}
                    >
                      <span className="text-xs font-pixel">•</span>
                      <span className="font-mono break-words">{n.message}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-textsecondary font-mono">No notifications yet</p>
              )}
            </div>
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
