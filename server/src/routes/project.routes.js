const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth.middleware')
const role = require('../middleware/role.middleware')
const {
  createProject,
  getMyProjects,
  getProject,
  updateProject,
  deleteProject
} = require('../controllers/project.controller')

router.post('/', auth, createProject)
router.get('/', auth, getMyProjects)
router.get('/:project_id', auth, role('leader', 'member', 'viewer'), getProject)
router.put('/:project_id', auth, role('leader'), updateProject)
router.delete('/:project_id', auth, role('leader'), deleteProject)

module.exports = router