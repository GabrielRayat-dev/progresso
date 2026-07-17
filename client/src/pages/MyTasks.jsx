import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/index'
import StatusDropdown from '../components/StatusDropdown'
import { priorityDot, statusPill, statusLabels } from '../constants/status'

export default function MyTasks() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => { fetchTasks() }, [])

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
          <h2 className="font-pixel text-base uppercase tracking-wide text-textprimary">My tasks</h2>
          <p className="text-textsecondary text-sm mt-1">
            {tasks.length} tasks across all projects
          </p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        {[
          { label: 'Total tasks', value: tasks.length, color: 'text-textprimary' },
          { label: 'Done', value: doneCount, color: 'text-success' },
          { label: 'Due today', value: todayCount, color: todayCount > 0 ? 'text-warning' : 'text-success' },
          { label: 'Overdue', value: overdueCount, color: overdueCount > 0 ? 'text-danger' : 'text-success' },
        ].map((s, i) => (
          <div key={i} className="card">
            <p className="text-textsecondary text-xs mb-2">{s.label}</p>
            <p className={`font-display text-2xl ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="pill-group mb-6">
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
            className={`pill pill-outline ${
              filter === f.key
                ? 'pill-active'
                : f.key === 'overdue' && overdueCount > 0
                ? 'text-danger'
                : ''
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Tasks */}
      {filtered.length === 0 ? (
        <div className="card text-center">
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
        <>
          {/* Mobile: stacked cards (md and below) */}
          <div className="md:hidden space-y-3">
            {filtered.map(task => (
              <div key={task.id} className="card">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-2.5 h-2.5 flex-shrink-0 ${priorityDot[task.priority] || 'bg-textsecondary'}`} />
                    <span className={`text-sm truncate ${
                      task.status === 'done' ? 'line-through text-textsecondary' : 'text-textprimary'
                    }`}>
                      {task.title}
                    </span>
                  </div>
                  <StatusDropdown
                    status={task.status}
                    onChange={(val) => handleStatusChange(task, val)}
                  />
                </div>
                <div className="flex items-center justify-between gap-3 mt-3">
                  <Link
                    to={`/projects/${task.project_id}`}
                    className="text-primary text-xs hover:underline truncate"
                  >
                    {task.project_name}
                  </Link>
                  <span className="text-textsecondary text-xs capitalize flex-shrink-0">{task.project_type}</span>
                </div>
                <div className="mt-2">
                  {task.due_date ? (
                    <span className={`text-xs ${
                      isOverdue(task) ? 'text-danger' :
                      isToday(task) ? 'text-warning' :
                      'text-textsecondary'
                    }`}>
                      {isOverdue(task) && <i className="ti ti-alert-circle text-xs mr-1" aria-hidden="true"></i>}
                      Due {new Date(task.due_date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
                    </span>
                  ) : (
                    <span className="text-textsecondary text-xs">No due date</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: table (md and up) */}
          <div className="hidden md:block pixel-card-retro overflow-hidden">
            <div className="overflow-x-auto">
              <div className="min-w-[700px]">
                {/* Table header */}
                <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b-[3px] border-border">
                  <div className="col-span-5 text-textsecondary text-xs font-medium">Task</div>
                  <div className="col-span-3 text-textsecondary text-xs font-medium">Project</div>
                  <div className="col-span-2 text-textsecondary text-xs font-medium">Due date</div>
                  <div className="col-span-2 text-textsecondary text-xs font-medium">Status</div>
                </div>

                {/* Task rows */}
                <div className="divide-y-[3px] divide-border">
                  {filtered.map(task => (
                    <div
                      key={task.id}
                      className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-background transition-colors items-center"
                    >
                      {/* Task name */}
                      <div className="col-span-5 flex items-center gap-2 min-w-0">
                        <div className={`w-2.5 h-2.5 flex-shrink-0 ${priorityDot[task.priority] || 'bg-textsecondary'}`}></div>
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
                        <StatusDropdown
                          status={task.status}
                          onChange={(val) => handleStatusChange(task, val)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
