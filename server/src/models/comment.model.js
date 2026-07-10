const db = require('../db')

const CommentModel = {

  // Add a comment to a task
  create: async (task_id, user_id, content) => {
    const result = await db.query(
      `INSERT INTO task_comments (task_id, user_id, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [task_id, user_id, content]
    )
    return result.rows[0]
  },

  // Get all comments for a task
  findByTask: async (task_id) => {
    const result = await db.query(
      `SELECT tc.*, u.full_name, u.avatar_url
       FROM task_comments tc
       JOIN users u ON u.id = tc.user_id
       WHERE tc.task_id = $1
       ORDER BY tc.created_at ASC`,
      [task_id]
    )
    return result.rows
  },

  // Delete a comment
  delete: async (id) => {
    await db.query('DELETE FROM task_comments WHERE id = $1', [id])
  }

}

module.exports = CommentModel