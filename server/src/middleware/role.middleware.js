const MemberModel = require('../models/member.model')

// Factory function — accepts allowed roles as arguments
// Usage: role('leader') or role('leader', 'member')
const role = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const project_id = req.params.project_id || req.body.project_id
      const user_id = req.user.id

      if (!project_id) {
        return res.status(400).json({ 
          error: 'Project ID is required.' 
        })
      }

      // Check membership and role
      const membership = await MemberModel.findMembership(project_id, user_id)

      if (!membership) {
        return res.status(403).json({ 
          error: 'You are not a member of this project.' 
        })
      }

      if (!allowedRoles.includes(membership.role)) {
        return res.status(403).json({ 
          error: `Access denied. Required role: ${allowedRoles.join(' or ')}.` 
        })
      }

      // Attach membership info to request for use in controllers
      req.membership = membership
      next()

    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
}

module.exports = role