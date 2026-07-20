const TaskModel = require('../models/task.model')
const ActivityModel = require('../models/activity.model')
const NotificationModel = require('../models/notification.model')
const UserModel = require('../models/user.model')
const MemberModel = require('../models/member.model')

// ─── CREATE TASK ──────────────────────────────────────────
const createTask = async (req, res) => {
  const { title, description, assigned_to, priority, due_date } = req.body
  const project_id = req.params.project_id

  if (!title) {
    return res.status(400).json({ error: 'Task title is required.' })
  }

  try {
    const task = await TaskModel.create(
      project_id, assigned_to, req.user.id,
      title, description, priority, due_date
    )

    // Log activity
    await ActivityModel.log(
      project_id, task.id, req.user.id,
      'task_created', null, title
    )

    // Notify assigned user if different from creator
    if (assigned_to && assigned_to !== req.user.id) {
      const creator = await UserModel.findById(req.user.id)
      await NotificationModel.create(
        assigned_to, project_id, task.id,
        'task_assigned',
        `${creator.full_name} assigned you a task: "${title}"`
      )
    }

    res.status(201).json({ message: 'Task created!', task })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ─── GET ALL TASKS IN PROJECT ─────────────────────────────
const getProjectTasks = async (req, res) => {
  try {
    // Verify user is a member of the project
    const membership = await MemberModel.findMembership(req.params.project_id, req.user.id)
    if (!membership) {
      return res.status(403).json({ error: 'You are not authorized to access this resource.' })
    }

    const tasks = await TaskModel.findByProject(req.params.project_id)
    res.json({ count: tasks.length, tasks })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ─── GET MY TASKS ACROSS ALL PROJECTS ────────────────────
const getMyTasks = async (req, res) => {
  try {
    const tasks = await TaskModel.findByUser(req.user.id)
    res.json({ count: tasks.length, tasks })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ─── GET SINGLE TASK ──────────────────────────────────────
const getTask = async (req, res) => {
  try {
    const task = await TaskModel.findById(req.params.task_id)
    if (!task) {
      return res.status(404).json({ error: 'Task not found.' })
    }

    // Verify user is a member of the project the task belongs to
    const membership = await MemberModel.findMembership(task.project_id, req.user.id)
    if (!membership) {
      return res.status(403).json({ error: 'You are not authorized to access this resource.' })
    }

    res.json(task)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ─── UPDATE TASK STATUS ───────────────────────────────────
const updateTaskStatus = async (req, res) => {
  const { status } = req.body
  const validStatuses = ['todo', 'in_progress', 'for_review', 'done', 'blocked']

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ 
      error: 'Status must be: todo, in_progress, for_review, done, or blocked.' 
    })
  }

  try {
    const oldTask = await TaskModel.findById(req.params.task_id)
    const task = await TaskModel.updateStatus(req.params.task_id, status)

    // Log activity with old and new status
    await ActivityModel.log(
      task.project_id, task.id, req.user.id,
      'status_changed',
      oldTask.status,
      status
    )

    res.json({ message: 'Task status updated!', task })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ─── UPDATE FULL TASK ─────────────────────────────────────
const updateTask = async (req, res) => {
  const { title, description, assigned_to, priority, due_date, status } = req.body
  try {
    const task = await TaskModel.update(
      req.params.task_id,
      title, description, assigned_to, priority, due_date, status
    )

    await ActivityModel.log(
      task.project_id, task.id, req.user.id,
      'task_updated', null, title
    )

    res.json({ message: 'Task updated!', task })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ─── DELETE TASK ──────────────────────────────────────────
const deleteTask = async (req, res) => {
  try {
    await TaskModel.delete(req.params.task_id)
    res.json({ message: 'Task deleted.' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { 
  createTask, 
  getProjectTasks, 
  getMyTasks, 
  getTask, 
  updateTaskStatus, 
  updateTask, 
  deleteTask 
}