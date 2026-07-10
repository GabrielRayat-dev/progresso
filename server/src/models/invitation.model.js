const db = require('../db')
const crypto = require('crypto')

const InvitationModel = {

  // Create an invitation
  create: async (project_id, invited_by, invited_email, role) => {
    const token = crypto.randomBytes(32).toString('hex')
    const result = await db.query(
      `INSERT INTO invitations (project_id, invited_by, invited_email, role, token)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [project_id, invited_by, invited_email, role, token]
    )
    return result.rows[0]
  },

  // Find invitation by token
  findByToken: async (token) => {
    const result = await db.query(
      `SELECT i.*, p.name as project_name, u.full_name as inviter_name
       FROM invitations i
       JOIN projects p ON p.id = i.project_id
       JOIN users u ON u.id = i.invited_by
       WHERE i.token = $1 AND i.status = 'pending' AND i.expires_at > NOW()`,
      [token]
    )
    return result.rows[0]
  },

  // Find pending invitations for an email
  findByEmail: async (email) => {
    const result = await db.query(
      `SELECT i.*, p.name as project_name, u.full_name as inviter_name
       FROM invitations i
       JOIN projects p ON p.id = i.project_id
       JOIN users u ON u.id = i.invited_by
       WHERE i.invited_email = $1 AND i.status = 'pending'`,
      [email]
    )
    return result.rows
  },

  // Update invitation status
  updateStatus: async (id, status) => {
    const result = await db.query(
      'UPDATE invitations SET status=$1 WHERE id=$2 RETURNING *',
      [status, id]
    )
    return result.rows[0]
  }

}

module.exports = InvitationModel