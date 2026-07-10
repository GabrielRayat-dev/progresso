const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const UserModel = require('../models/user.model')
const MemberModel = require('../models/member.model')
const InvitationModel = require('../models/invitation.model')

// ─── REGISTER ────────────────────────────────────────────
const register = async (req, res) => {
  const { full_name, email, password } = req.body

  if (!full_name || !email || !password) {
    return res.status(400).json({ 
      error: 'Full name, email and password are required.' 
    })
  }

  try {
    // Check if email already exists
    const existing = await UserModel.findByEmail(email)
    if (existing) {
      return res.status(400).json({ 
        error: 'Email already registered.' 
      })
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10)

    // Create user
    const user = await UserModel.create(full_name, email, hashed)

    // Check if there are pending invitations for this email
    const pendingInvitations = await InvitationModel.findByEmail(email)
    if (pendingInvitations.length > 0) {
      for (const invite of pendingInvitations) {
        await MemberModel.add(invite.project_id, user.id, invite.role)
        await InvitationModel.updateStatus(invite.id, 'accepted')
      }
    }

    // Create token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      message: 'Account created successfully! Welcome to Progresso 🚀',
      token,
      user
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ─── LOGIN ────────────────────────────────────────────────
const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Email and password are required.' 
    })
  }

  try {
    const user = await UserModel.findByEmail(email)

    if (!user) {
      return res.status(404).json({ 
        error: 'No account found with that email.' 
      })
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res.status(401).json({ 
        error: 'Incorrect password.' 
      })
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      message: `Welcome back, ${user.full_name}! 👋`,
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        avatar_url: user.avatar_url
      }
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ─── GET PROFILE ──────────────────────────────────────────
const getProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id)
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { register, login, getProfile }