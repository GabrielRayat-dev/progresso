import { useState, useEffect } from 'react'
import { Doughnut, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js'
import api from '../api/index'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

export default function Analytics() {
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState('all')

  useEffect(() => { fetchData() }, [])

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

  const filteredTasks = selectedProject === 'all'
    ? tasks
    : tasks.filter(t => t.project_id === parseInt(selectedProject))

  const doneTasks = filteredTasks.filter(t => t.status === 'done').length
  const inProgressTasks = filteredTasks.filter(t => t.status === 'in_progress').length
  const todoTasks = filteredTasks.filter(t => t.status === 'todo').length
  const blockedTasks = filteredTasks.filter(t => t.status === 'blocked').length
  const reviewTasks = filteredTasks.filter(t => t.status === 'for_review').length
  const totalTasks = filteredTasks.length
  const completionRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

  const overdueCount = filteredTasks.filter(t => {
    if (!t.due_date || t.status === 'done') return false
    return new Date(t.due_date) < new Date()
  }).length

  const onTimeRate = totalTasks > 0
    ? Math.round(((totalTasks - overdueCount) / totalTasks) * 100)
    : 100

  // Doughnut chart data
  const doughnutData = {
    labels: ['Done', 'In progress', 'For review', 'Blocked', 'Todo'],
    datasets: [{
      data: [doneTasks, inProgressTasks, reviewTasks, blockedTasks, todoTasks],
      backgroundColor: ['#2ECC71', '#F39C12', '#6C63FF', '#E74C3C', '#8B8FA8'],
      borderWidth: 0,
    }]
  }

  const doughnutOptions = {
    plugins: {
      legend: {
        display: false
      }
    },
    cutout: '70%',
  }

  // Bar chart — project progress
  const barData = {
    labels: projects.map(p => p.name.length > 15 ? p.name.slice(0, 15) + '...' : p.name),
    datasets: [{
      label: 'Progress %',
      data: projects.map(p => {
        const total = parseInt(p.total_tasks) || 0
        const done = parseInt(p.done_tasks) || 0
        return total > 0 ? Math.round((done / total) * 100) : 0
      }),
      backgroundColor: '#6C63FF',
      borderRadius: 6,
    }]
  }

  const barOptions = {
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: {
        grid: { color: '#2A2D3E' },
        ticks: { color: '#8B8FA8', font: { size: 11 } }
      },
      y: {
        grid: { color: '#2A2D3E' },
        ticks: { color: '#8B8FA8', font: { size: 11 } },
        max: 100,
      }
    }
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
          <h2 className="text-xl font-medium text-textprimary">Analytics</h2>
          <p className="text-textsecondary text-sm mt-1">Track your progress and performance</p>
        </div>
        <select
          value={selectedProject}
          onChange={e => setSelectedProject(e.target.value)}
          className="bg-surface border border-border rounded-lg px-4 py-2 text-sm text-textprimary focus:outline-none focus:border-primary"
        >
          <option value="all">All projects</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Completion rate', value: `${completionRate}%`, color: 'text-success', icon: 'ti-circle-check' },
          { label: 'On time rate', value: `${onTimeRate}%`, color: 'text-primary', icon: 'ti-clock' },
          { label: 'Tasks done', value: doneTasks, color: 'text-success', icon: 'ti-checkbox' },
          { label: 'Blocked tasks', value: blockedTasks, color: blockedTasks > 0 ? 'text-danger' : 'text-success', icon: 'ti-ban' },
        ].map((m, i) => (
          <div key={i} className="bg-surface border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <i className={`ti ${m.icon} text-textsecondary text-sm`} aria-hidden="true"></i>
              <p className="text-textsecondary text-xs">{m.label}</p>
            </div>
            <p className={`text-2xl font-medium ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-2 gap-6 mb-6">

        {/* Doughnut */}
        <div className="bg-surface border border-border rounded-xl p-5">
          <h3 className="text-textprimary text-sm font-medium mb-4">Task status breakdown</h3>
          {totalTasks === 0 ? (
            <div className="text-center py-8">
              <p className="text-textsecondary text-sm">No tasks yet</p>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <div className="w-40 h-40 flex-shrink-0">
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                {[
                  { label: 'Done', value: doneTasks, color: '#2ECC71' },
                  { label: 'In progress', value: inProgressTasks, color: '#F39C12' },
                  { label: 'For review', value: reviewTasks, color: '#6C63FF' },
                  { label: 'Blocked', value: blockedTasks, color: '#E74C3C' },
                  { label: 'Todo', value: todoTasks, color: '#8B8FA8' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: item.color }}></div>
                      <span className="text-textsecondary text-xs">{item.label}</span>
                    </div>
                    <span className="text-textprimary text-xs font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Project progress bar */}
        <div className="bg-surface border border-border rounded-xl p-5">
          <h3 className="text-textprimary text-sm font-medium mb-4">Project progress</h3>
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-textsecondary text-sm">No projects yet</p>
            </div>
          ) : (
            <Bar data={barData} options={barOptions} />
          )}
        </div>
      </div>

      {/* Project breakdown table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="text-textprimary text-sm font-medium">Project breakdown</h3>
        </div>
        {projects.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-textsecondary text-sm">No projects yet</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-4 px-5 py-3 bg-background">
              <div className="col-span-4 text-textsecondary text-xs font-medium">Project</div>
              <div className="col-span-2 text-textsecondary text-xs font-medium">Type</div>
              <div className="col-span-2 text-textsecondary text-xs font-medium">Tasks</div>
              <div className="col-span-2 text-textsecondary text-xs font-medium">Progress</div>
              <div className="col-span-2 text-textsecondary text-xs font-medium">Status</div>
            </div>
            {projects.map(p => {
              const total = parseInt(p.total_tasks) || 0
              const done = parseInt(p.done_tasks) || 0
              const pct = total > 0 ? Math.round((done / total) * 100) : 0
              return (
                <div key={p.id} className="grid grid-cols-12 gap-4 px-5 py-3 items-center hover:bg-background transition-colors">
                  <div className="col-span-4">
                    <p className="text-textprimary text-sm truncate">{p.name}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-textsecondary text-xs capitalize">{p.type}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-textsecondary text-xs">{done}/{total}</span>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }}></div>
                      </div>
                      <span className="text-textsecondary text-xs">{pct}%</span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center gap-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${p.status === 'active' ? 'bg-success' : 'bg-textsecondary'}`}></div>
                      <span className="text-textsecondary text-xs capitalize">{p.status}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}