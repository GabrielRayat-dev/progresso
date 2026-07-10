const db = require('../db')

const UserModel = {

  // Find user by email
  findByEmail: async (email) => {
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )
    return result.rows[0]
  },

  // Find user by ID
  findById: async (id) => {
    const result = await db.query(
      'SELECT id, full_name, email, avatar_url, created_at FROM users WHERE id = $1',
      [id]
    )
    return result.rows[0]
  },

  // Create new user
  create: async (full_name, email, password) => {
    const result = await db.query(
      `INSERT INTO users (full_name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, full_name, email, created_at`,
      [full_name, email, password]
    )
    return result.rows[0]
  },

  // Update avatar
  updateAvatar: async (id, avatar_url) => {
    const result = await db.query(
      'UPDATE users SET avatar_url = $1 WHERE id = $2 RETURNING id, full_name, email, avatar_url',
      [avatar_url, id]
    )
    return result.rows[0]
  }

}

module.exports = UserModel