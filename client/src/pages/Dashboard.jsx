import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/index'

const statusColors = {
  todo: 'text-textsecondary',
  in_progress: 'text-warning',
  for_review: 'text-primary',
  done: 'text-success',
  blocked: 'text-danger',
}

const statusLabels = {
  todo: 'Todo',
  in_progress: 'In progress',
  for_review: 'For review',
  done: 'Done',
  blocked: 'Blocked',
}

const statusBg = {
  todo: 'bg-surface text-textsecondary',
  in_progress: 'bg-warning bg-opacity-10 text-warning',
  for_review: 'bg-primary bg-opacity-10 text-primary',
  done: 'bg-success bg-opacity-10 text-success',
  blocked: 'bg-danger bg-opacity-10 text-danger',
}

const typeBadge = {
  thesis: 'bg-primary bg-opacity-10 text-primary',
  school: 'bg-secondary bg-opacity-10 text-secondary',
  freelance: 'bg-warning bg-opacity-10 text-warning',
  personal: 'bg-success bg-opacity-10 text-success',
}

export default function Dashboard() {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, taskRes] = await Promise.all([
          api.get('/projects'),
          api.get('/tasks/my')
        ])
        setProjects(projRes.data.projects || [])
        setTasks(taskRes.data.tasks || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const totalTasks = tasks.length
  const doneTasks = tasks.filter(t => t.status === 'done').length
  const overdueTasks = tasks.filter(t => {
    if (!t.due_date) return false
    return new Date(t.due_date) < new Date() && t.status !== 'done'
  }).length
  const dueTodayTasks = tasks.filter(t => {
    if (!t.due_date) return false
    const today = new Date().toISOString().split('T')[0]
    return t.due_date.split('T')[0] === today && t.status !== 'done'
  }).length

  const initials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex items-center gap-2 text-textsecondary">
        <i className="ti ti-loader-2 animate-spin" aria-hidden="true"></i>
        Loading...
      </div>
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-medium text-textprimary">
            {greeting()}, {user?.full_name?.split(' ')[0]} 👋
          </h2>
          <p className="text-textsecondary text-sm mt-1">
            {dueTodayTasks > 0
              ? `You have ${dueTodayTasks} task${dueTodayTasks > 1 ? 's' : ''} due today`
              : 'You are all caught up today!'}
          </p>
        </div>
        <Link
          to="/projects"
          className="flex items-center gap-2 bg-primary text-white text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          <i className="ti ti-plus" aria-hidden="true"></i>
          New project
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total projects', value: projects.length, sub: `${projects.filter(p => p.status === 'active').length} active`, color: 'text-primary' },
          { label: 'Tasks done', value: doneTasks, sub: `of ${totalTasks} total`, color: 'text-success' },
          { label: 'Due today', value: dueTodayTasks, sub: dueTodayTasks > 0 ? 'needs attention' : 'all clear', color: dueTodayTasks > 0 ? 'text-warning' : 'text-success' },
          { label: 'Overdue', value: overdueTasks, sub: overdueTasks > 0 ? 'needs attention' : 'all clear', color: overdueTasks > 0 ? 'text-danger' : 'text-success' },
        ].map((m, i) => (
          <div key={i} className="bg-surface border border-border rounded-xl p-4">
            <p className="text-textsecondary text-xs mb-2">{m.label}</p>
            <p className={`text-2xl font-medium ${m.color} mb-1`}>{m.value}</p>
            <p className="text-textsecondary text-xs">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-2 gap-6">

        {/* Recent projects */}
        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-textprimary text-sm font-medium">Recent projects</h3>
            <Link to="/projects" className="text-primary text-xs hover:underline">View all</Link>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-8">
              <i className="ti ti-folder-off text-textsecondary text-2xl mb-2 block" aria-hidden="true"></i>
              <p className="text-textsecondary text-sm">No projects yet</p>
              <Link to="/projects" className="text-primary text-xs hover:underline mt-1 block">
                Create your first project
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.slice(0, 4).map(project => {
                const total = parseInt(project.total_tasks) || 0
                const done = parseInt(project.done_tasks) || 0
                const percent = total > 0 ? Math.round((done / total) * 100) : 0
                return (
                  <Link
                    key={project.id}
                    to={`/projects/${project.id}`}
                    className="block bg-background rounded-lg p-3 hover:border-primary border border-border transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-textprimary text-sm font-medium truncate">{project.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${typeBadge[project.type] || 'bg-surface text-textsecondary'}`}>
                        {project.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      <span className="text-textsecondary text-xs">{percent}%</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-textsecondary text-xs">{done} of {total} tasks done</span>
                      {project.deadline && (
                        <span className="text-textsecondary text-xs flex items-center gap-1">
                          <i className="ti ti-calendar text-xs" aria-hidden="true"></i>
                          {new Date(project.deadline).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* My tasks */}
        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-textprimary text-sm font-medium">My tasks</h3>
            <Link to="/tasks" className="text-primary text-xs hover:underline">View all</Link>
          </div>

          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <i className="ti ti-checkbox text-textsecondary text-2xl mb-2 block" aria-hidden="true"></i>
              <p className="text-textsecondary text-sm">No tasks assigned yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {tasks.slice(0, 6).map(task => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 bg-background rounded-lg px-3 py-2.5 border border-border"
                >
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    task.status === 'done' ? 'bg-success' :
                    task.status === 'in_progress' ? 'bg-warning' :
                    task.status === 'blocked' ? 'bg-danger' :
                    task.status === 'for_review' ? 'bg-primary' : 'bg-textsecondary'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs truncate ${task.status === 'done' ? 'line-through text-textsecondary' : 'text-textprimary'}`}>
                      {task.title}
                    </p>
                    <p className="text-textsecondary text-xs truncate">{task.project_name}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${statusBg[task.status]}`}>
                    {statusLabels[task.status]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Empty state if no projects */}
      {projects.length === 0 && tasks.length === 0 && (
        <div className="mt-6 bg-surface border border-border rounded-xl p-12 text-center">
          <div className="w-14 h-14 bg-primary bg-opacity-10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <i className="ti ti-rocket text-primary text-2xl" aria-hidden="true"></i>
          </div>
          <h3 className="text-textprimary font-medium mb-2">Welcome to Progresso!</h3>
          <p className="text-textsecondary text-sm mb-6 max-w-sm mx-auto">
            Create your first project to start tracking tasks and collaborating with your team.
          </p>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm hover:opacity-90 transition-opacity"
          >
            <i className="ti ti-plus" aria-hidden="true"></i>
            Create first project
          </Link>
        </div>
      )}
    </div>
  )
}