const db = require('../db')

const TaskModel = {

  // Create a task
  create: async (project_id, assigned_to, created_by, title, description, priority, due_date) => {
    const result = await db.query(
      `INSERT INTO tasks (project_id, assigned_to, created_by, title, description, priority, due_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [project_id, assigned_to, created_by, title, description, priority, due_date]
    )
    return result.rows[0]
  },

  // Get all tasks for a project
  findByProject: async (project_id) => {
    const result = await db.query(
      `SELECT t.*, 
              u.full_name as assignee_name,
              u.avatar_url as assignee_avatar,
              COUNT(tc.id) as comment_count
       FROM tasks t
       LEFT JOIN users u ON u.id = t.assigned_to
       LEFT JOIN task_comments tc ON tc.task_id = t.id
       WHERE t.project_id = $1
       GROUP BY t.id, u.full_name, u.avatar_url
       ORDER BY t.created_at DESC`,
      [project_id]
    )
    return result.rows
  },

  // Get all tasks assigned to a user across all projects
  findByUser: async (user_id) => {
    const result = await db.query(
      `SELECT t.*, p.name as project_name, p.type as project_type
       FROM tasks t
       JOIN projects p ON p.id = t.project_id
       WHERE t.assigned_to = $1
       ORDER BY t.due_date ASC NULLS LAST`,
      [user_id]
    )
    return result.rows
  },

  // Get single task
  findById: async (id) => {
    const result = await db.query(
      `SELECT t.*, 
              u.full_name as assignee_name,
              u.avatar_url as assignee_avatar,
              c.full_name as creator_name
       FROM tasks t
       LEFT JOIN users u ON u.id = t.assigned_to
       LEFT JOIN users c ON c.id = t.created_by
       WHERE t.id = $1`,
      [id]
    )
    return result.rows[0]
  },

  // Update task status
  updateStatus: async (id, status) => {
    const result = await db.query(
      `UPDATE tasks SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *`,
      [status, id]
    )
    return result.rows[0]
  },

  // Update full task
  update: async (id, title, description, assigned_to, priority, due_date, status) => {
    const result = await db.query(
      `UPDATE tasks 
       SET title=$1, description=$2, assigned_to=$3, priority=$4, due_date=$5, status=$6, updated_at=NOW()
       WHERE id=$7
       RETURNING *`,
      [title, description, assigned_to, priority, due_date, status, id]
    )
    return result.rows[0]
  },

  // Delete task
  delete: async (id) => {
    await db.query('DELETE FROM tasks WHERE id = $1', [id])
  }

}

module.exports = TaskModel