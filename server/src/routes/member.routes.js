const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth.middleware')
const role = require('../middleware/role.middleware')
const { getMembers, updateRole, removeMember } = require('../controllers/member.controller')

router.get('/:project_id', auth, role('leader', 'member', 'viewer'), getMembers)
router.put('/:project_id', auth, role('leader'), updateRole)
router.delete('/:project_id/:user_id', auth, role('leader'), removeMember)

module.exports = router