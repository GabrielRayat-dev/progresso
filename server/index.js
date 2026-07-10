const express = require('express')
const cors = require('cors')
require('dotenv').config()
require('./src/db')

const authRoutes = require('./src/routes/auth.routes')
const projectRoutes = require('./src/routes/project.routes')
const taskRoutes = require('./src/routes/task.routes')
const memberRoutes = require('./src/routes/member.routes')
const invitationRoutes = require('./src/routes/invitation.routes')
const commentRoutes = require('./src/routes/comment.routes')
const notificationRoutes = require('./src/routes/notification.routes')

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/members', memberRoutes)
app.use('/api/invitations', invitationRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/notifications', notificationRoutes)

app.get('/', (req, res) => {
  res.send('🚀 Progresso API is running!')
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})