const db = require('../db')

const NotificationModel = {

  // Create a notification
  create: async (user_id, project_id, task_id, type, message) => {
    const result = await db.query(
      `INSERT INTO notifications (user_id, project_id, task_id, type, message)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [user_id, project_id, task_id, type, message]
    )
    return result.rows[0]
  },

  // Get all notifications for a user
  findByUser: async (user_id) => {
    const result = await db.query(
      `SELECT * FROM notifications
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 30`,
      [user_id]
    )
    return result.rows
  },

  // Mark all notifications as read
  markAllRead: async (user_id) => {
    await db.query(
      'UPDATE notifications SET is_read = true WHERE user_id = $1',
      [user_id]
    )
  },

  // Count unread notifications
  countUnread: async (user_id) => {
    const result = await db.query(
      'SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false',
      [user_id]
    )
    return parseInt(result.rows[0].count)
  },

  // Mark a single notification as read
  markOneRead: async (user_id, id) => {
    await db.query(
      'UPDATE notifications SET is_read = true WHERE user_id = $1 AND id = $2',
      [user_id, id]
    )
  },

}

module.exports = NotificationModel