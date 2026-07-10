const db = require('../db')

const ProjectModel = {

  // Create a new project
  create: async (name, description, type, deadline, owner_id) => {
    const result = await db.query(
      `INSERT INTO projects (name, description, type, deadline, owner_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, description, type, deadline, owner_id]
    )
    return result.rows[0]
  },

  // Get all projects for a user (projects they own or are a member of)
  findAllByUser: async (user_id) => {
    const result = await db.query(
      `SELECT p.*, 
              u.full_name as owner_name,
              pm.role as my_role,
              COUNT(DISTINCT t.id) as total_tasks,
              COUNT(DISTINCT CASE WHEN t.status = 'done' THEN t.id END) as done_tasks
       FROM projects p
       JOIN project_members pm ON pm.project_id = p.id AND pm.user_id = $1
       JOIN users u ON u.id = p.owner_id
       LEFT JOIN tasks t ON t.project_id = p.id
       WHERE p.status != 'archived'
       GROUP BY p.id, u.full_name, pm.role
       ORDER BY p.created_at DESC`,
      [user_id]
    )
    return result.rows
  },

  // Get single project by ID
  findById: async (id) => {
    const result = await db.query(
      `SELECT p.*, u.full_name as owner_name
       FROM projects p
       JOIN users u ON u.id = p.owner_id
       WHERE p.id = $1`,
      [id]
    )
    return result.rows[0]
  },

  // Update project
  update: async (id, name, description, type, deadline, status) => {
    const result = await db.query(
      `UPDATE projects 
       SET name=$1, description=$2, type=$3, deadline=$4, status=$5, updated_at=NOW()
       WHERE id=$6
       RETURNING *`,
      [name, description, type, deadline, status, id]
    )
    return result.rows[0]
  },

  // Delete project
  delete: async (id) => {
    await db.query('DELETE FROM projects WHERE id = $1', [id])
  }

}

module.exports = ProjectModel