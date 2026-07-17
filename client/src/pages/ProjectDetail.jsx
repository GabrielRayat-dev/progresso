import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/index'
import RetroBar from '../components/RetroBar'
import { statusPill, statusLabels, statusTint, statusDot, priorityDot } from '../constants/status'

export default function ProjectDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedTask, setSelectedTask] = useState(null)
  const [comments, setComments] = useState([])
  const [activity, setActivity] = useState([])
  const [comment, setComment] = useState('')
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [taskForm, setTaskForm] = useState({
    title: '', description: '', priority: 'medium', due_date: '', assigned_to: ''
  })
  const [creating, setCreating] = useState(false)
  const [showInvite, setShowInvite] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviting, setInviting] = useState(false)
  const [openStatusTaskId, setOpenStatusTaskId] = useState(null)
  const [hoveredStatus, setHoveredStatus] = useState(null)

  useEffect(() => { fetchAll() }, [id])
  useEffect(() => {
    if (selectedTask) {
      fetchComments(selectedTask.id)
      fetchActivity(selectedTask.id)
    }
  }, [selectedTask])
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

  const fetchAll = async () => {
    try {
      const [projRes, taskRes, memberRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks/${id}`),
        api.get(`/members/${id}`)
      ])
      setProject(projRes.data)
      setTasks(taskRes.data.tasks || [])
      setMembers(memberRes.data.members || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async (taskId) => {
    try {
      const res = await api.get(`/comments/${taskId}`)
      setComments(res.data.comments || [])
    } catch (err) { console.error(err) }
  }

  const fetchActivity = async (taskId) => {
    try {
      const res = await api.get(`/tasks/${id}/${taskId}`)
      setActivity([])
    } catch (err) { console.error(err) }
  }

  const handleCreateTask = async (e) => {
    e.preventDefault()
    if (!taskForm.title) return
    setCreating(true)
    try {
      await api.post(`/tasks/${id}`, {
        ...taskForm,
        assigned_to: taskForm.assigned_to || null
      })
      await fetchAll()
      setShowTaskModal(false)
      setTaskForm({ title: '', description: '', priority: 'medium', due_date: '', assigned_to: '' })
    } catch (err) {
      console.error(err)
    } finally {
      setCreating(false)
    }
  }

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.patch(`/tasks/${id}/${taskId}/status`, { status: newStatus })
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
      if (selectedTask?.id === taskId) {
        setSelectedTask({ ...selectedTask, status: newStatus })
      }
    } catch (err) { console.error(err) }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return
    try {
      await api.post(`/comments/${selectedTask.id}`, { content: comment })
      setComment('')
      fetchComments(selectedTask.id)
    } catch (err) { console.error(err) }
  }

  const handleInvite = async (e) => {
    e.preventDefault()
    if (!inviteEmail) return
    setInviting(true)
    try {
      await api.post(`/invitations/${id}`, { invited_email: inviteEmail, role: 'member' })
      setInviteEmail('')
      setShowInvite(false)
      fetchAll()
    } catch (err) {
      console.error(err)
    } finally {
      setInviting(false)
    }
  }

  const filteredTasks = filter === 'all'
    ? tasks
    : tasks.filter(t => t.status === filter)

  const totalTasks = tasks.length
  const doneTasks = tasks.filter(t => t.status === 'done').length
  const percent = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

  const initials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date)
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex items-center gap-2 text-textsecondary">
        <i className="ti ti-loader-2 animate-spin" aria-hidden="true"></i>
        Loading...
      </div>
    </div>
  )

  if (!project) return (
    <div className="text-center py-12">
      <p className="text-textsecondary">Project not found.</p>
      <Link to="/projects" className="text-primary text-sm hover:underline mt-2 block">Back to projects</Link>
    </div>
  )

  return (
    <div className="flex flex-col lg:flex-row gap-6">

      {/* Left — Tasks */}
      <div className="flex-1 min-w-0">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-textsecondary mb-4">
          <Link to="/projects" className="hover:text-primary transition-colors">Projects</Link>
          <i className="ti ti-chevron-right text-xs" aria-hidden="true"></i>
          <span className="text-textprimary">{project.name}</span>
        </div>

        {/* Project header */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <h2 className="font-pixel text-base uppercase tracking-wide text-textprimary">{project.name}</h2>
            {project.description && (
              <p className="text-textsecondary text-sm mt-1">{project.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInvite(true)}
              className="btn btn-outline"
            >
              <i className="ti ti-user-plus text-sm" aria-hidden="true"></i>
              Invite
            </button>
            <button
              onClick={() => setShowTaskModal(true)}
              className="btn btn-primary"
            >
              <i className="ti ti-plus text-sm" aria-hidden="true"></i>
              Add task
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Total', value: totalTasks, color: 'text-textprimary' },
            { label: 'Done', value: doneTasks, color: 'text-success' },
            { label: 'In progress', value: tasks.filter(t => t.status === 'in_progress').length, color: 'text-warning' },
            { label: 'Blocked', value: tasks.filter(t => t.status === 'blocked').length, color: 'text-danger' },
          ].map((s, i) => (
            <div key={i} className="card text-center">
              <p className={`font-display text-lg ${s.color}`}>{s.value}</p>
              <p className="text-textsecondary text-xs">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="card mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-textsecondary text-xs">Overall progress</span>
            <span className="text-black font-pixel text-xs">{percent}%</span>
          </div>
          <RetroBar value={percent} />
        </div>

        {/* Filter tabs */}
        <div className="pill-group mb-4">
          {['all', 'todo', 'in_progress', 'for_review', 'done', 'blocked'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`pill pill-outline ${
                filter === f
                  ? 'pill-active'
                  : ''
              }`}
            >
              {f === 'all' ? 'All' : statusLabels[f]}
            </button>
          ))}
        </div>

        {/* Task list */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="card text-center">
              <i className="ti ti-checkbox text-textsecondary text-2xl mb-2 block" aria-hidden="true"></i>
              <p className="text-textsecondary text-sm">No tasks yet</p>
              <button
                onClick={() => setShowTaskModal(true)}
                className="text-primary text-xs hover:underline mt-1 block mx-auto"
              >
                Add the first task
              </button>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`flex items-center gap-3 bg-background border-[3px] border-border shadow-retro rounded-lg px-4 py-3 cursor-pointer transition-colors hover:border-primary ${
                  selectedTask?.id === task.id ? 'border-primary' : 'border-border'
                }`}
              >
                <div className={`w-2.5 h-2.5 flex-shrink-0 ${priorityDot[task.priority] || 'bg-textsecondary'}`}></div>
                <span className={`flex-1 text-sm truncate ${task.status === 'done' ? 'line-through text-textsecondary' : 'text-textprimary'}`}>
                  {task.title}
                </span>
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
                        className={`badge focus:outline-none cursor-pointer gap-1.5 ${cfg.className}`}
                        style={cfg.style}
                      >
                        <span className={`w-2.5 h-2.5 ${statusDot[task.status] || 'bg-textsecondary'}`} />
                        <span>{statusLabels[task.status] || 'Todo'}</span>
                        <i className="ti ti-chevron-down text-[10px] opacity-70" aria-hidden="true"></i>
                      </button>

                      {isOpen && (
                        <div className="absolute right-0 mt-2 w-44 pixel-card-retro overflow-hidden z-20">
                          {Object.entries(statusLabels).map(([val, label]) => {
                            const isHovered = hoveredStatus === val
                            const isCurrent = task.status === val
                            const tintClass = isHovered ? (statusTint[val] || 'bg-surface') : ''
                            return (
                              <button
                                key={val}
                                type="button"
                                onMouseEnter={() => setHoveredStatus(val)}
                                onMouseLeave={() => setHoveredStatus(null)}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleStatusChange(task.id, val)
                                  setOpenStatusTaskId(null)
                                  setHoveredStatus(null)
                                }}
                                className={`w-full px-3 py-2 text-xs flex items-center gap-2 text-left transition-colors border-b-[3px] border-border last:border-0 ${
                                  isCurrent ? 'font-medium' : ''
                                } ${tintClass}`}
                              >
                                <span className={`w-2.5 h-2.5 ${statusDot[val] || 'bg-textsecondary'}`} />
                                <span className="text-black">{label}</span>
                                {isCurrent && <i className="ti ti-check text-xs ml-auto text-black" aria-hidden="true"></i>}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })()}
                {task.assignee_name && (
                  <div className="w-6 h-6 border-[3px] border-border bg-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-black text-[10px] font-pixel">{initials(task.assignee_name)}</span>
                  </div>
                )}
                {task.comment_count > 0 && (
                  <div className="flex items-center gap-1 text-textsecondary">
                    <i className="ti ti-message text-xs" aria-hidden="true"></i>
                    <span className="text-xs">{task.comment_count}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right — Task detail / Members */}
      <div className="w-full lg:w-72 flex-shrink-0 space-y-4">

        {/* Task detail panel */}
        {selectedTask ? (
          <div className="pixel-card-retro overflow-hidden">
            <div className="p-4 border-b-[3px] border-border">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="text-textprimary text-sm font-medium">{selectedTask.title}</h4>
                <button onClick={() => setSelectedTask(null)} className="text-textsecondary hover:text-danger border-[3px] border-transparent hover:border-border p-1 flex-shrink-0">
                  <i className="ti ti-x text-sm" aria-hidden="true"></i>
                </button>
              </div>
              <div className="flex items-center gap-2">
                {(() => {
                  const cfg = statusPill[selectedTask.status] || statusPill.todo
                  return (
                    <span className={`badge flex-shrink-0 ${cfg.className}`} style={cfg.style}>
                      {statusLabels[selectedTask.status]}
                    </span>
                  )
                })()}
                <span className="text-textsecondary text-xs capitalize">{selectedTask.priority} priority</span>
              </div>
              {selectedTask.description && (
                <p className="text-textsecondary text-xs mt-2 leading-relaxed">{selectedTask.description}</p>
              )}
              {selectedTask.due_date && (
                <p className="text-textsecondary text-xs mt-2 flex items-center gap-1">
                  <i className="ti ti-calendar text-xs" aria-hidden="true"></i>
                  Due {new Date(selectedTask.due_date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
                </p>
              )}
            </div>

            {/* Comments */}
            <div className="p-4">
              <p className="text-textsecondary text-xs font-medium mb-3">Comments</p>
              <div className="space-y-3 mb-3 max-h-48 overflow-y-auto">
                {comments.length === 0 ? (
                  <p className="text-textsecondary text-xs text-center py-2">No comments yet</p>
                ) : (
                  comments.map(c => (
                    <div key={c.id} className="flex gap-2">
                      <div className="w-6 h-6 border-[3px] border-border bg-primary flex items-center justify-center flex-shrink-0">
                        <span className="text-black text-[10px] font-pixel">{initials(c.full_name)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-textprimary text-xs font-medium">{c.full_name}</span>
                          <span className="text-textsecondary text-xs">{timeAgo(c.created_at)}</span>
                        </div>
                        <p className="text-textsecondary text-xs mt-0.5 leading-relaxed">{c.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="input text-xs py-2"
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  <i className="ti ti-send text-xs" aria-hidden="true"></i>
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="card text-center">
            <i className="ti ti-click text-textsecondary text-xl mb-2 block" aria-hidden="true"></i>
            <p className="text-textsecondary text-xs">Click a task to see details and comments</p>
          </div>
        )}

        {/* Members */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <p className="text-textprimary text-sm font-medium">Team</p>
            <button
              onClick={() => setShowInvite(true)}
              className="text-primary text-xs hover:underline"
            >
              + Invite
            </button>
          </div>
          <div className="space-y-2">
            {members.map(m => (
              <div key={m.id} className="flex items-center gap-2">
                <div className="w-7 h-7 border-[3px] border-border bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-black text-[10px] font-pixel">{initials(m.full_name)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-textprimary text-xs font-medium truncate">{m.full_name}</p>
                  <p className="text-textsecondary text-xs capitalize">{m.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-textsecondary text-xs">{m.done_tasks}/{m.total_tasks}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Deadline */}
        {project.deadline && (
          <div className="card">
            <p className="text-textsecondary text-xs mb-1">Project deadline</p>
            <p className="text-textprimary text-sm font-medium">
              {new Date(project.deadline).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
            <p className="text-textsecondary text-xs mt-1">
              {Math.ceil((new Date(project.deadline) - new Date()) / (1000 * 60 * 60 * 24))} days remaining
            </p>
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="card-lg w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-pixel text-sm uppercase tracking-wide text-textprimary">Add new task</h3>
              <button onClick={() => setShowTaskModal(false)} className="text-textsecondary hover:text-danger border-[3px] border-transparent hover:border-border p-1">
                <i className="ti ti-x" aria-hidden="true"></i>
              </button>
            </div>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-textsecondary text-xs mb-1.5">Task title *</label>
                <input
                  type="text"
                  value={taskForm.title}
                  onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder="What needs to be done?"
                  className="input"
                />
              </div>
              <div>
                <label className="block text-textsecondary text-xs mb-1.5">Description</label>
                <textarea
                  value={taskForm.description}
                  onChange={e => setTaskForm({ ...taskForm, description: e.target.value })}
                  placeholder="Add more details..."
                  rows={2}
                  className="input resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-textsecondary text-xs mb-1.5">Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })}
                    className="input"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-textsecondary text-xs mb-1.5">Due date</label>
                  <input
                    type="date"
                    value={taskForm.due_date}
                    onChange={e => setTaskForm({ ...taskForm, due_date: e.target.value })}
                    className="input"
                  />
                </div>
              </div>
              <div>
                <label className="block text-textsecondary text-xs mb-1.5">Assign to</label>
                <select
                  value={taskForm.assigned_to}
                  onChange={e => setTaskForm({ ...taskForm, assigned_to: e.target.value })}
                  className="input"
                >
                  <option value="">Unassigned</option>
                  {members.map(m => (
                    <option key={m.user_id} value={m.user_id}>{m.full_name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="btn btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="btn btn-primary flex-1 disabled:opacity-50"
                >
                  {creating ? (
                    <><i className="ti ti-loader-2 animate-spin" aria-hidden="true"></i>Adding...</>
                  ) : (
                    <><i className="ti ti-plus" aria-hidden="true"></i>Add task</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="card-lg w-full max-w-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-pixel text-sm uppercase tracking-wide text-textprimary">Invite teammate</h3>
              <button onClick={() => setShowInvite(false)} className="text-textsecondary hover:text-danger border-[3px] border-transparent hover:border-border p-1">
                <i className="ti ti-x" aria-hidden="true"></i>
              </button>
            </div>
            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-textsecondary text-xs mb-1.5">Email address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="teammate@email.com"
                  className="input"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowInvite(false)}
                  className="btn btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviting}
                  className="btn btn-primary flex-1 disabled:opacity-50"
                >
                  {inviting ? (
                    <><i className="ti ti-loader-2 animate-spin" aria-hidden="true"></i>Sending...</>
                  ) : (
                    <><i className="ti ti-mail" aria-hidden="true"></i>Send invite</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}