const NotificationModel = require('../models/notification.model')

// ─── GET MY NOTIFICATIONS ─────────────────────────────────
const getNotifications = async (req, res) => {
  try {
    const notifications = await NotificationModel.findByUser(req.user.id)
    const unread = await NotificationModel.countUnread(req.user.id)
    res.json({ unread, notifications })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ─── MARK ALL AS READ ─────────────────────────────────────
const markAllRead = async (req, res) => {
  try {
    await NotificationModel.markAllRead(req.user.id)
    res.json({ message: 'All notifications marked as read.' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { getNotifications, markAllRead }