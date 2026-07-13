import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/index'

const typePill = {
  thesis: { className: 'text-primary', style: { background: '#1E1A3F' } },
  school: { className: 'text-secondary', style: { background: '#0A2A2A' } },
  freelance: { className: 'text-warning', style: { background: '#2A1F0A' } },
  personal: { className: 'text-success', style: { background: '#0A2A1A' } },
}

const filters = ['All', 'Thesis', 'School', 'Freelance', 'Personal']

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    name: '', description: '', type: 'personal', deadline: ''
  })
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { fetchProjects() }, [])

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects')
      setProjects(res.data.projects || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.name) return setError('Project name is required.')
    setCreating(true)
    try {
      await api.post('/projects', form)
      await fetchProjects()
      setShowModal(false)
      setForm({ name: '', description: '', type: 'personal', deadline: '' })
      setError('')
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.')
    } finally {
      setCreating(false)
    }
  }

  const filtered = filter === 'All'
    ? projects
    : projects.filter(p => p.type === filter.toLowerCase())

  const getPercent = (project) => {
    const total = parseInt(project.total_tasks) || 0
    const done = parseInt(project.done_tasks) || 0
    return total > 0 ? Math.round((done / total) * 100) : 0
  }

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
          <h2 className="text-xl font-medium text-textprimary">Projects</h2>
          <p className="text-textsecondary text-sm mt-1">
            {projects.length} project{projects.length !== 1 ? 's' : ''} · {projects.filter(p => p.status === 'active').length} active
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary text-white text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          <i className="ti ti-plus" aria-hidden="true"></i>
          New project
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={filter === f ? { background: '#1E1A3F' } : undefined}
            className={`text-xs px-4 py-1.5 rounded-full border transition-colors ${
              filter === f
                ? 'text-primary border-primary border-opacity-40'
                : 'border-border text-textsecondary hover:text-textprimary'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Projects grid */}
      {filtered.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl p-12 text-center">
          <i className="ti ti-folder-off text-textsecondary text-3xl mb-3 block" aria-hidden="true"></i>
          <h3 className="text-textprimary font-medium mb-2">No projects found</h3>
          <p className="text-textsecondary text-sm mb-4">
            {filter === 'All' ? 'Create your first project to get started.' : `No ${filter.toLowerCase()} projects yet.`}
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-lg text-sm hover:opacity-90 transition-opacity"
          >
            <i className="ti ti-plus" aria-hidden="true"></i>
            Create project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filtered.map(project => {
            const percent = getPercent(project)
            const total = parseInt(project.total_tasks) || 0
            const done = parseInt(project.done_tasks) || 0
            return (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="bg-surface border border-border rounded-xl p-5 hover:border-primary transition-colors block"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-textprimary font-medium text-sm leading-tight flex-1 pr-3">{project.name}</h3>
                  {(() => {
                    const cfg = typePill[project.type] || { className: 'bg-surface text-textsecondary', style: undefined }
                    return (
                      <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${cfg.className}`} style={cfg.style}>
                        {project.type}
                      </span>
                    )
                  })()}
                </div>

                {project.description && (
                  <p className="text-textsecondary text-xs mb-3 line-clamp-2">{project.description}</p>
                )}

                {/* Task chips */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex items-center gap-1 text-xs text-success">
                    <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                    {done} done
                  </span>
                  <span className="flex items-center gap-1 text-xs text-warning">
                    <span className="w-1.5 h-1.5 rounded-full bg-warning"></span>
                    {total - done} remaining
                  </span>
                </div>

                {/* Progress */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                  <span className="text-textsecondary text-xs">{percent}%</span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${project.status === 'active' ? 'bg-success' : 'bg-textsecondary'}`}></span>
                    <span className="text-textsecondary text-xs capitalize">{project.status}</span>
                  </div>
                  {project.deadline && (
                    <span className="text-textsecondary text-xs flex items-center gap-1">
                      <i className="ti ti-calendar text-xs" aria-hidden="true"></i>
                      {new Date(project.deadline).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-4">
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-textprimary font-medium">Create new project</h3>
              <button
                onClick={() => { setShowModal(false); setError('') }}
                className="text-textsecondary hover:text-textprimary transition-colors"
              >
                <i className="ti ti-x" aria-hidden="true"></i>
              </button>
            </div>

            {error && (
              <div className="flex items-center gap-2 border border-danger border-opacity-30 rounded-lg px-4 py-3 mb-4" style={{ background: '#2A0A0A' }}>
                <i className="ti ti-alert-circle text-danger text-sm" aria-hidden="true"></i>
                <span className="text-danger text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-textsecondary text-xs mb-1.5">Project name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Stellar's Dental Clinic"
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-textprimary placeholder-textsecondary focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-textsecondary text-xs mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="What is this project about?"
                  rows={3}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-textprimary placeholder-textsecondary focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-textsecondary text-xs mb-1.5">Project type *</label>
                <select
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-textprimary focus:outline-none focus:border-primary transition-colors"
                >
                  <option value="thesis">Thesis / Capstone</option>
                  <option value="school">School Subject / Activity</option>
                  <option value="freelance">Freelance / Client Work</option>
                  <option value="personal">Personal / Side Project</option>
                </select>
              </div>

              <div>
                <label className="block text-textsecondary text-xs mb-1.5">Deadline</label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={e => setForm({ ...form, deadline: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-textprimary focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setError('') }}
                  className="flex-1 border border-border text-textsecondary py-2.5 rounded-lg text-sm hover:text-textprimary transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {creating ? (
                    <><i className="ti ti-loader-2 animate-spin" aria-hidden="true"></i>Creating...</>
                  ) : (
                    <><i className="ti ti-plus" aria-hidden="true"></i>Create project</>
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