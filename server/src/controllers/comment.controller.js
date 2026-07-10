const CommentModel = require('../models/comment.model')
const ActivityModel = require('../models/activity.model')
const TaskModel = require('../models/task.model')
const NotificationModel = require('../models/notification.model')
const UserModel = require('../models/user.model')

// ─── ADD COMMENT ──────────────────────────────────────────
const addComment = async (req, res) => {
  const { content } = req.body
  const task_id = req.params.task_id

  if (!content) {
    return res.status(400).json({ error: 'Comment content is required.' })
  }

  try {
    const comment = await CommentModel.create(task_id, req.user.id, content)

    // Get task info for notification
    const task = await TaskModel.findById(task_id)
    const commenter = await UserModel.findById(req.user.id)

    // Notify task assignee if different from commenter
    if (task.assigned_to && task.assigned_to !== req.user.id) {
      await NotificationModel.create(
        task.assigned_to, task.project_id, task_id,
        'comment_added',
        `${commenter.full_name} commented on your task: "${task.title}"`
      )
    }

    // Log activity
    await ActivityModel.log(
      task.project_id, task_id, req.user.id,
      'comment_added', null, content
    )

    res.status(201).json({ message: 'Comment added!', comment })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ─── GET COMMENTS FOR TASK ────────────────────────────────
const getComments = async (req, res) => {
  try {
    const comments = await CommentModel.findByTask(req.params.task_id)
    res.json({ count: comments.length, comments })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// ─── DELETE COMMENT ───────────────────────────────────────
const deleteComment = async (req, res) => {
  try {
    await CommentModel.delete(req.params.comment_id)
    res.json({ message: 'Comment deleted.' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = { addComment, getComments, deleteComment }