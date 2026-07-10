const db = require('../db')

const ActivityModel = {

  // Log an activity
  log: async (project_id, task_id, user_id, action, old_value, new_value) => {
    const result = await db.query(
      `INSERT INTO activity_logs (project_id, task_id, user_id, action, old_value, new_value)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [project_id, task_id, user_id, action, old_value, new_value]
    )
    return result.rows[0]
  },

  // Get activity logs for a task
  findByTask: async (task_id) => {
    const result = await db.query(
      `SELECT al.*, u.full_name, u.avatar_url
       FROM activity_logs al
       JOIN users u ON u.id = al.user_id
       WHERE al.task_id = $1
       ORDER BY al.created_at ASC`,
      [task_id]
    )
    return result.rows
  },

  // Get activity logs for a project
  findByProject: async (project_id) => {
    const result = await db.query(
      `SELECT al.*, u.full_name, u.avatar_url
       FROM activity_logs al
       JOIN users u ON u.id = al.user_id
       WHERE al.project_id = $1
       ORDER BY al.created_at DESC
       LIMIT 50`,
      [project_id]
    )
    return result.rows
  }

}

module.exports = ActivityModel