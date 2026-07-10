const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth.middleware')
const role = require('../middleware/role.middleware')
const { 
  sendInvitation, 
  acceptInvitation, 
  getMyInvitations 
} = require('../controllers/invitation.controller')

router.post('/:project_id', auth, role('leader'), sendInvitation)
router.get('/accept/:token', auth, acceptInvitation)
router.get('/my', auth, getMyInvitations)

module.exports = router