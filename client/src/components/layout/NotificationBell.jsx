import { useEffect, useRef, useState } from 'react'
import api from '../../api'

const TYPE_ICON = {
  task_assigned: 'ti-bell',
  project_invitation: 'ti-user-plus',
  comment_added: 'ti-message',
}

function relativeTime(iso) {
  const then = new Date(iso).getTime()
  const diff = Date.now() - then
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'just now'
  if (min < 60) return `${min}m`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h`
  const day = Math.floor(hr / 24)
  if (day < 7) return `${day}d`
  return `${Math.floor(day / 7)}w`
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [unread, setUnread] = useState(0)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const ref = useRef(null)

  const load = async () => {
    try {
      const res = await api.get('/notifications')
      setUnread(res.data.unread)
      setItems(res.data.notifications)
    } catch {
      // keep previous state on failure
    }
  }

  // Poll the unread count in the background
  useEffect(() => {
    load()
    const id = setInterval(load, 30000)
    return () => clearInterval(id)
  }, [])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  // Mark all as read — clears the badge when the tray is opened
  const markAllRead = async () => {
    try {
      await api.patch('/notifications/read')
      setUnread(0)
      setItems((prev) => prev.map((n) => ({ ...n, is_read: true })))
    } catch {
      // keep previous state on failure
    }
  }

  const toggle = () => {
    const next = !open
    setOpen(next)
    if (next) {
      // Mark read first so the GET below returns the cleared state
      markAllRead().finally(load)
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={toggle}
        className="relative w-8 h-8 border-[3px] border-border bg-surface flex items-center justify-center text-textprimary shadow-retro transition-transform hover:bg-black hover:text-white active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
        aria-label="Notifications"
      >
        <i className="ti ti-bell text-base" aria-hidden="true"></i>
        {unread > 0 && (
          <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 bg-primary text-black text-[10px] font-pixel border-[2px] border-border flex items-center justify-center">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-80 pixel-card-retro overflow-hidden z-50">
          <div className="px-4 py-3 border-b-[3px] border-border flex items-center justify-between">
            <span className="font-pixel text-xs uppercase text-textprimary">Notifications</span>
            {unread > 0 && (
              <span className="text-[11px] text-primary">{unread} new</span>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading && items.length === 0 ? (
              <div className="px-4 py-8 text-center text-textsecondary text-sm">
                Loading…
              </div>
            ) : items.length === 0 ? (
              <div className="px-4 py-8 text-center text-textsecondary text-sm">
                No notifications yet
              </div>
            ) : (
              items.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-4 py-3 border-b-[3px] border-border last:border-0 transition-colors ${
                    n.is_read ? '' : 'bg-primary/10'
                  }`}
                >
                  <div className="w-7 h-7 border-[3px] border-border bg-surface flex items-center justify-center flex-shrink-0 mt-0.5">
                    <i
                      className={`ti ${TYPE_ICON[n.type] || 'ti-bell'} text-sm text-textsecondary`}
                      aria-hidden="true"
                    ></i>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-textprimary leading-snug">{n.message}</p>
                    <p className="text-[11px] text-textsecondary mt-1">
                      {relativeTime(n.created_at)}
                    </p>
                  </div>
                  {!n.is_read && (
                    <span className="w-2 h-2 bg-primary mt-1.5 flex-shrink-0"></span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
