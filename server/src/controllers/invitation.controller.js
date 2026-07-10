const InvitationModel = require('../models/invitation.model')
const MemberModel = require('../models/member.model')
const UserModel = require('../models/user.model')
const NotificationModel = require('../models/notification.model')
const ActivityModel = require('../models/activity.model')

// ─── SEND INVITATION ──────────────────────────────────────
const sendInvitation = async (req, res) => {
  const { invited_email, role } = req.body
  const project_id = req.params.project_id

  if (!invited_email) {
    return res.status(400).json({ error: 'Email is required.' })
  }

  try {
    // Check if user already a member
    const existingUser = await UserModel.findByEmail(invited_email)
    if (existingUser) {
      const alreadyMember = await MemberModel.findMembership(
        project_id, existingUser.id
      )
      if (alreadyMember) {
        return res.status(400).json({ 
          error: 'This user is already a member of this project.' 
        })
      }

      // User exists — add directly and notify
      await MemberModel.add(project_id, existingUser.id, role || 'member')

      const inviter = await UserModel.findById(req.user.id)
      await NotificationModel.create(
        existingUser.id, project_id, null,
        'project_invitation',
        `${inviter.full_name} added you to a project. Check your projects!`
      )

      await ActivityModel.log(
        project_id, null, req.user.id,
        'member_invited', null, invited_email
      )

      return res.status(201).json({ 
        message: `${invited_email} has been added to the project!` 
      })
    }

    // User does not exist — create invitation record
    const invitation = await InvitationModel.create(
      project_id, req.user.id, invited_email, role || 'member'
    )

    res.status(201).json({
      message: `Invitation sent to ${invited_email}!`,
      invitation_token: invitation.token
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ─── ACCEPT INVITATION BY TOKEN ───────────────────────────
const acceptInvitation = async (req, res) => {
  const { token } = req.params

  try {
    const invitation = await InvitationModel.findByToken(token)

    if (!invitation) {
      return res.status(404).json({ 
        error: 'Invitation not found or has expired.' 
      })
    }

    // Add user to project
    await MemberModel.add(
      invitation.project_id, req.user.id, invitation.role
    )

    // Mark invitation as accepted
    await InvitationModel.updateStatus(invitation.id, 'accepted')

    await ActivityModel.log(
      invitation.project_id, null, req.user.id,
      'member_joined', null, `User joined via invitation`
    )

    res.json({ 
      message: `You have joined ${invitation.project_name}!`,
      project_id: invitation.project_id
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ─── GET PENDING INVITATIONS FOR LOGGED IN USER ───────────
const getMyInvitations = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id)
    const invitations = await InvitationModel.findByEmail(user.email)
    res.json({ count: invitations.length, invitations })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { sendInvitation, acceptInvitation, getMyInvitations }