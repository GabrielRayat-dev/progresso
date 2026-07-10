const MemberModel = require('../models/member.model')
const ActivityModel = require('../models/activity.model')

// ─── GET ALL MEMBERS ──────────────────────────────────────
const getMembers = async (req, res) => {
  try {
    const members = await MemberModel.findByProject(req.params.project_id)
    res.json({ count: members.length, members })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ─── UPDATE MEMBER ROLE ───────────────────────────────────
const updateRole = async (req, res) => {
  const { user_id, role } = req.body
  const validRoles = ['leader', 'member', 'viewer']

  if (!validRoles.includes(role)) {
    return res.status(400).json({ 
      error: 'Role must be: leader, member, or viewer.' 
    })
  }

  try {
    const member = await MemberModel.updateRole(
      req.params.project_id, user_id, role
    )

    await ActivityModel.log(
      req.params.project_id, null, req.user.id,
      'role_changed', null, `User role changed to ${role}`
    )

    res.json({ message: 'Member role updated!', member })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ─── REMOVE MEMBER ────────────────────────────────────────
const removeMember = async (req, res) => {
  try {
    await MemberModel.remove(req.params.project_id, req.params.user_id)

    await ActivityModel.log(
      req.params.project_id, null, req.user.id,
      'member_removed', null, `User ${req.params.user_id} removed`
    )

    res.json({ message: 'Member removed from project.' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { getMembers, updateRole, removeMember }