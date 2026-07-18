const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth.middleware')
const { getNotifications, markAllRead, markOneRead } = require('../controllers/notification.controller')

router.get('/', auth, getNotifications)
router.patch('/read', auth, markAllRead)
router.patch('/:id/read', auth, markOneRead)

module.exports = router