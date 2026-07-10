const db = require('../db')

const MemberModel = {

  // Add a member to a project
  add: async (project_id, user_id, role) => {
    const result = await db.query(
      `INSERT INTO project_members (project_id, user_id, role)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [project_id, user_id, role]
    )
    return result.rows[0]
  },

  // Get all members of a project
  findByProject: async (project_id) => {
    const result = await db.query(
      `SELECT pm.*, u.full_name, u.email, u.avatar_url,
              COUNT(DISTINCT t.id) as total_tasks,
              COUNT(DISTINCT CASE WHEN t.status = 'done' THEN t.id END) as done_tasks
       FROM project_members pm
       JOIN users u ON u.id = pm.user_id
       LEFT JOIN tasks t ON t.assigned_to = pm.user_id AND t.project_id = pm.project_id
       WHERE pm.project_id = $1
       GROUP BY pm.id, u.full_name, u.email, u.avatar_url
       ORDER BY pm.joined_at ASC`,
      [project_id]
    )
    return result.rows
  },

  // Check if user is a member of a project
  findMembership: async (project_id, user_id) => {
    const result = await db.query(
      'SELECT * FROM project_members WHERE project_id = $1 AND user_id = $2',
      [project_id, user_id]
    )
    return result.rows[0]
  },

  // Update member role
  updateRole: async (project_id, user_id, role) => {
    const result = await db.query(
      `UPDATE project_members SET role=$1 
       WHERE project_id=$2 AND user_id=$3 
       RETURNING *`,
      [role, project_id, user_id]
    )
    return result.rows[0]
  },

  // Remove member from project
  remove: async (project_id, user_id) => {
    await db.query(
      'DELETE FROM project_members WHERE project_id=$1 AND user_id=$2',
      [project_id, user_id]
    )
  }

}

module.exports = MemberModel