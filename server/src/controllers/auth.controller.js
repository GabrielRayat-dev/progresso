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

// ─── CHANGE PASSWORD ──────────────────────────────────────
const changePassword = async (req, res) => {
  const { current_password, new_password } = req.body

  if (!current_password || !new_password) {
    return res.status(400).json({ 
      error: 'Current password and new password are required.' 
    })
  }

  if (new_password.length < 6) {
    return res.status(400).json({ 
      error: 'New password must be at least 6 characters.' 
    })
  }

  try {
    const user = await UserModel.findByEmail(
      (await UserModel.findById(req.user.id)).email
    )

    const match = await bcrypt.compare(current_password, user.password)
    if (!match) {
      return res.status(401).json({ 
        error: 'Current password is incorrect.' 
      })
    }

    const hashed = await bcrypt.hash(new_password, 10)
    await UserModel.updatePassword(req.user.id, hashed)

    res.json({ message: 'Password changed successfully!' })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ─── UPDATE PROFILE NAME ──────────────────────────────────
const updateProfile = async (req, res) => {
  const { full_name } = req.body

  if (!full_name) {
    return res.status(400).json({ 
      error: 'Full name is required.' 
    })
  }

  try {
    const user = await UserModel.updateName(req.user.id, full_name)
    res.json({ message: 'Profile updated!', user })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ─── UPLOAD AVATAR ────────────────────────────────────────
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' })
    }

    const supabase = require('../supabase')
    const fileExt = req.file.originalname.split('.').pop()
    const fileName = `avatar_${req.user.id}_${Date.now()}.${fileExt}`

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from('avatars')
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true
      })

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    // Get public URL
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    const avatar_url = data.publicUrl

    // Save URL to database
    const user = await UserModel.updateAvatar(req.user.id, avatar_url)

    res.json({ 
      message: 'Avatar uploaded successfully!', 
      avatar_url,
      user 
    })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { 
  register, 
  login, 
  getProfile, 
  changePassword, 
  updateProfile,
  uploadAvatar
}