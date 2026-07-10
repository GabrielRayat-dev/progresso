const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth.middleware')
const { getNotifications, markAllRead } = require('../controllers/notification.controller')

router.get('/', auth, getNotifications)
router.patch('/read', auth, markAllRead)

module.exports = router