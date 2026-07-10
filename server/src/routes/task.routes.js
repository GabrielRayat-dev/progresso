const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth.middleware')
const role = require('../middleware/role.middleware')
const {
  createTask,
  getProjectTasks,
  getMyTasks,
  getTask,
  updateTaskStatus,
  updateTask,
  deleteTask
} = require('../controllers/task.controller')

// Personal tasks across all projects
router.get('/my', auth, getMyTasks)

// Project specific tasks
router.post('/:project_id', auth, role('leader', 'member'), createTask)
router.get('/:project_id', auth, role('leader', 'member', 'viewer'), getProjectTasks)
router.get('/:project_id/:task_id', auth, role('leader', 'member', 'viewer'), getTask)
router.patch('/:project_id/:task_id/status', auth, role('leader', 'member'), updateTaskStatus)
router.put('/:project_id/:task_id', auth, role('leader', 'member'), updateTask)
router.delete('/:project_id/:task_id', auth, role('leader'), deleteTask)

module.exports = router