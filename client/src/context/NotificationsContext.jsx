import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useAuth } from './AuthContext'

const API_BASE = 'http://localhost:5000/api'

const NotificationsContext = createContext(null)

export function NotificationsProvider({ children }) {
  const { token } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)

  // GET /api/notifications → populate the bell dropdown + unread badge
  const fetchNotifications = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to load notifications')
      const data = await res.json()
      // Backend returns { unread, notifications }
      const list = Array.isArray(data) ? data : data.notifications || []
      setNotifications(list)
      setUnreadCount(data.unread ?? list.filter((n) => !n.is_read).length)
    } catch (err) {
      console.error('[notifications] fetch failed:', err)
    } finally {
      setLoading(false)
    }
  }, [token])

  // PATCH /api/notifications/read → mark all as read, clears the purple dot
  const markAllRead = useCallback(async () => {
    if (!token) return
    try {
      const res = await fetch(`${API_BASE}/notifications/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to mark notifications read')
      // Optimistically clear the badge; refetch keeps the list in sync
      setUnreadCount(0)
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
      await fetchNotifications()
    } catch (err) {
      console.error('[notifications] markAllRead failed:', err)
    }
  }, [token, fetchNotifications])

  // Initial load + refresh whenever the auth token changes (login/logout)
  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const value = {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAllRead,
  }

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  )
}

export const useNotifications = () => {
  const ctx = useContext(NotificationsContext)
  if (!ctx) {
    throw new Error('useNotifications must be used within a NotificationsProvider')
  }
  return ctx
}
