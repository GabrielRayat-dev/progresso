import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/index'

const statusPill = {
  todo: { className: 'text-textsecondary bg-surface border border-border', style: undefined },
  in_progress: { className: 'text-warning', style: { background: '#2A1F0A' } },
  for_review: { className: 'text-primary', style: { background: '#1E1A3F' } },
  done: { className: 'text-success', style: { background: '#0A2A1A' } },
  blocked: { className: 'text-danger', style: { background: '#2A0A0A' } },
}

const statusTint = {
  todo: '#1A1D27',
  in_progress: '#2A1F0A',
  for_review: '#1E1A3F',
  done: '#0A2A1A',
  blocked: '#2A0A0A',
}

const statusDot = {
  todo: 'bg-textsecondary',
  in_progress: 'bg-warning',
  for_review: 'bg-primary',
  done: 'bg-success',
  blocked: 'bg-danger',
}

const statusLabels = {
  todo: 'Todo',
  in_progress: 'In progress',
  for_review: 'For review',
  done: 'Done',
  blocked: 'Blocked',
}

const priorityDot = {
  high: 'bg-danger',
  medium: 'bg-warning',
  low: 'bg-success',
}

export default function MyTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [openStatusTaskId, setOpenStatusTaskId] = useState(null)
  const [hoveredStatus, setHoveredStatus] = useState(null)

  useEffect(() => { fetchTasks() }, [])
  useEffect(() => {
    const handlePointerDown = (e) => {
      if (!e.target.closest('[data-status-dropdown="root"]')) {
        setOpenStatusTaskId(null)
        setHoveredStatus(null)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks/my')
      setTasks(res.data.tasks || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (task, newStatus) => {
    try {
      await api.patch(`/tasks/${task.project_id}/${task.id}/status`, { status: newStatus })
      setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t))
    } catch (err) { console.error(err) }
  }

  const isOverdue = (task) => {
    if (!task.due_date || task.status === 'done') return false
    return new Date(task.due_date) < new Date()
  }

  const isToday = (task) => {
    if (!task.due_date || task.status === 'done') return false
    const today = new Date().toISOString().split('T')[0]
    return task.due_date.split('T')[0] === today
  }

  const filtered = filter === 'all'
    ? tasks
    : filter === 'overdue'
    ? tasks.filter(t => isOverdue(t))
    : filter === 'today'
    ? tasks.filter(t => isToday(t))
    : tasks.filter(t => t.status === filter)

  const overdueCount = tasks.filter(t => isOverdue(t)).length
  const todayCount = tasks.filter(t => isToday(t)).length
  const doneCount = tasks.filter(t => t.status === 'done').length

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-medium text-textprimary">My tasks</h2>
          <p className="text-textsecondary text-sm mt-1">
            {tasks.length} tasks across all projects
          </p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total tasks', value: tasks.length, color: 'text-textprimary' },
          { label: 'Done', value: doneCount, color: 'text-success' },
          { label: 'Due today', value: todayCount, color: todayCount > 0 ? 'text-warning' : 'text-success' },
          { label: 'Overdue', value: overdueCount, color: overdueCount > 0 ? 'text-danger' : 'text-success' },
        ].map((s, i) => (
          <div key={i} className="bg-surface border border-border rounded-xl p-4">
            <p className="text-textsecondary text-xs mb-2">{s.label}</p>
            <p className={`text-2xl font-medium ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {[
          { key: 'all', label: 'All' },
          { key: 'today', label: `Due today ${todayCount > 0 ? `(${todayCount})` : ''}` },
          { key: 'overdue', label: `Overdue ${overdueCount > 0 ? `(${overdueCount})` : ''}` },
          { key: 'in_progress', label: 'In progress' },
          { key: 'for_review', label: 'For review' },
          { key: 'blocked', label: 'Blocked' },
          { key: 'done', label: 'Done' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={filter === f.key ? { background: '#1E1A3F' } : undefined}
            className={`text-xs px-4 py-1.5 rounded-full border transition-colors ${
              filter === f.key
                ? 'text-primary border-primary border-opacity-40'
                : f.key === 'overdue' && overdueCount > 0
                ? 'border-danger border-opacity-40 text-danger'
                : 'border-border text-textsecondary hover:text-textprimary'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Tasks */}
      {filtered.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl p-12 text-center">
          <i className="ti ti-checkbox text-textsecondary text-3xl mb-3 block" aria-hidden="true"></i>
          <h3 className="text-textprimary font-medium mb-2">
            {filter === 'all' ? 'No tasks yet' : `No ${filter.replace('_', ' ')} tasks`}
          </h3>
          <p className="text-textsecondary text-sm">
            {filter === 'all'
              ? 'Tasks assigned to you will appear here.'
              : 'Nothing here right now.'}
          </p>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-border">
            <div className="col-span-5 text-textsecondary text-xs font-medium">Task</div>
            <div className="col-span-3 text-textsecondary text-xs font-medium">Project</div>
            <div className="col-span-2 text-textsecondary text-xs font-medium">Due date</div>
            <div className="col-span-2 text-textsecondary text-xs font-medium">Status</div>
          </div>

          {/* Task rows */}
          <div className="divide-y divide-border">
            {filtered.map(task => (
              <div
                key={task.id}
                className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-background transition-colors items-center"
              >
                {/* Task name */}
                <div className="col-span-5 flex items-center gap-2 min-w-0">
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${priorityDot[task.priority] || 'bg-textsecondary'}`}></div>
                  <span className={`text-sm truncate ${
                    task.status === 'done'
                      ? 'line-through text-textsecondary'
                      : 'text-textprimary'
                  }`}>
                    {task.title}
                  </span>
                </div>

                {/* Project */}
                <div className="col-span-3 min-w-0">
                  <Link
                    to={`/projects/${task.project_id}`}
                    className="text-primary text-xs hover:underline truncate block"
                  >
                    {task.project_name}
                  </Link>
                  <span className="text-textsecondary text-xs capitalize">{task.project_type}</span>
                </div>

                {/* Due date */}
                <div className="col-span-2">
                  {task.due_date ? (
                    <span className={`text-xs ${
                      isOverdue(task) ? 'text-danger' :
                      isToday(task) ? 'text-warning' :
                      'text-textsecondary'
                    }`}>
                      {isOverdue(task) && <i className="ti ti-alert-circle text-xs mr-1" aria-hidden="true"></i>}
                      {new Date(task.due_date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
                    </span>
                  ) : (
                    <span className="text-textsecondary text-xs">No due date</span>
                  )}
                </div>

                {/* Status */}
                <div className="col-span-2">
                  {(() => {
                    const cfg = statusPill[task.status] || statusPill.todo
                    const isOpen = openStatusTaskId === task.id
                    return (
                      <div className="relative inline-flex" data-status-dropdown="root">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            setHoveredStatus(null)
                            setOpenStatusTaskId(isOpen ? null : task.id)
                          }}
                          className={`text-xs px-2 py-1 rounded-full border-0 focus:outline-none cursor-pointer font-medium inline-flex items-center gap-1.5 ${cfg.className}`}
                          style={cfg.style}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusDot[task.status] || 'bg-textsecondary'}`} />
                          <span>{statusLabels[task.status] || 'Todo'}</span>
                          <i className="ti ti-chevron-down text-[10px] opacity-70" aria-hidden="true"></i>
                        </button>

                        {isOpen && (
                          <div className="absolute right-0 mt-2 w-44 bg-surface border border-border rounded-xl overflow-hidden z-20">
                            {Object.entries(statusLabels).map(([val, label]) => {
                              const isHovered = hoveredStatus === val
                              const isCurrent = task.status === val
                              const bg = isHovered ? (statusTint[val] || '#1A1D27') : undefined
                              return (
                                <button
                                  key={val}
                                  type="button"
                                  onMouseEnter={() => setHoveredStatus(val)}
                                  onMouseLeave={() => setHoveredStatus(null)}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleStatusChange(task, val)
                                    setOpenStatusTaskId(null)
                                    setHoveredStatus(null)
                                  }}
                                  className={`w-full px-3 py-2 text-xs flex items-center gap-2 text-left transition-colors ${
                                    isCurrent ? 'font-medium' : ''
                                  }`}
                                  style={bg ? { background: bg } : undefined}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${statusDot[val] || 'bg-textsecondary'}`} />
                                  <span className={(statusPill[val] || statusPill.todo).className.split(' ')[0]}>
                                    {label}
                                  </span>
                                  {isCurrent && <i className="ti ti-check text-xs ml-auto text-textsecondary" aria-hidden="true"></i>}
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}