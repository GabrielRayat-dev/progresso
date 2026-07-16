import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/index'
import RetroBar from '../components/RetroBar'
import { statusPill, statusLabels, statusDot } from '../constants/status'

const typePill = {
  thesis: { className: 'bg-primary text-black border-[3px] border-border', style: undefined },
  school: { className: 'bg-secondary text-black border-[3px] border-border', style: undefined },
  freelance: { className: 'bg-warning text-black border-[3px] border-border', style: undefined },
  personal: { className: 'bg-success text-black border-[3px] border-border', style: undefined },
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
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <h2 className="font-pixel text-base uppercase tracking-wide text-textprimary">
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
          className="btn btn-primary"
        >
          <i className="ti ti-plus" aria-hidden="true"></i>
          New project
        </Link>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        {[
          { label: 'Total projects', value: projects.length, sub: `${projects.filter(p => p.status === 'active').length} active`, color: 'text-primary' },
          { label: 'Tasks done', value: doneTasks, sub: `of ${totalTasks} total`, color: 'text-success' },
          { label: 'Due today', value: dueTodayTasks, sub: dueTodayTasks > 0 ? 'needs attention' : 'all clear', color: dueTodayTasks > 0 ? 'text-warning' : 'text-success' },
          { label: 'Overdue', value: overdueTasks, sub: overdueTasks > 0 ? 'needs attention' : 'all clear', color: overdueTasks > 0 ? 'text-danger' : 'text-success' },
        ].map((m, i) => (
          <div key={i} className="card">
            <p className="text-textsecondary text-xs mb-2">{m.label}</p>
            <p className={`font-display text-2xl ${m.color} mb-1`}>{m.value}</p>
            <p className="text-textsecondary text-xs">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent projects */}
        <div className="card">
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
                    className="block bg-surface border-[3px] border-border shadow-retro p-3 hover:border-primary transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-textprimary text-sm font-medium truncate">{project.name}</span>
                      {(() => {
                        const cfg = typePill[project.type] || { className: 'bg-surface text-textsecondary border-[3px] border-border', style: undefined }
                        return (
                          <span className={`badge flex-shrink-0 ${cfg.className}`} style={cfg.style}>
                            {project.type}
                          </span>
                        )
                      })()}
                    </div>
                    <div className="flex items-center gap-2">
                      <RetroBar value={percent} />
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
        <div className="card">
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
                  className="flex items-center gap-3 bg-surface border-[3px] border-border shadow-retro px-3 py-2.5"
                >
                  <div className={`w-2.5 h-2.5 flex-shrink-0 ${statusDot[task.status] || 'bg-textsecondary'}`}></div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs truncate ${task.status === 'done' ? 'line-through text-textsecondary' : 'text-textprimary'}`}>
                      {task.title}
                    </p>
                    <p className="text-textsecondary text-xs truncate">{task.project_name}</p>
                  </div>
                  {(() => {
                    const cfg = statusPill[task.status] || statusPill.todo
                    return (
                      <span className={`badge flex-shrink-0 ${cfg.className}`} style={cfg.style}>
                        {statusLabels[task.status]}
                      </span>
                    )
                  })()}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Empty state if no projects */}
      {projects.length === 0 && tasks.length === 0 && (
        <div className="mt-6 card text-center">
          <div className="w-14 h-14 border-[3px] border-border shadow-retro flex items-center justify-center mx-auto mb-4 bg-primary/10">
            <i className="ti ti-rocket text-primary text-2xl" aria-hidden="true"></i>
          </div>
          <h3 className="text-textprimary font-medium mb-2">Welcome to Progresso!</h3>
          <p className="text-textsecondary text-sm mb-6 max-w-sm mx-auto">
            Create your first project to start tracking tasks and collaborating with your team.
          </p>
          <Link
            to="/projects"
            className="btn btn-primary btn-lg"
          >
            <i className="ti ti-plus" aria-hidden="true"></i>
            Create first project
          </Link>
        </div>
      )}
    </div>
  )
}