const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
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
app.use(helmet())
app.use(cors({
  origin: [
    'https://your-progresso-app.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true
}))
app.use(express.json())

// Rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
})

// Apply rate limiters
app.use('/api/auth', authLimiter)
app.use('/api', generalLimiter)

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