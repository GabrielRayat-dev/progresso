const express = require('express')
const router = express.Router()
const multer = require('multer')
const auth = require('../middleware/auth.middleware')
const { 
  register, 
  login, 
  getProfile,
  changePassword,
  updateProfile,
  uploadAvatar
} = require('../controllers/auth.controller')

// Multer setup — store file in memory
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp']
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Only JPG, PNG, and WEBP images are allowed.'))
    }
  }
})

router.post('/register', register)
router.post('/login', login)
router.get('/profile', auth, getProfile)
router.put('/profile', auth, updateProfile)
router.patch('/change-password', auth, changePassword)
router.post('/avatar', auth, upload.single('avatar'), uploadAvatar)

module.exports = router