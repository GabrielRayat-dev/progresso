const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth.middleware')
const { addComment, getComments, deleteComment } = require('../controllers/comment.controller')

router.post('/:task_id', auth, addComment)
router.get('/:task_id', auth, getComments)
router.delete('/:task_id/:comment_id', auth, deleteComment)

module.exports = router