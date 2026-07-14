import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/index'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

export default function Calendar() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [current, setCurrent] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(null)

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

  const year = current.getFullYear()
  const month = current.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = new Date()

  const prevMonth = () => setCurrent(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrent(new Date(year, month + 1, 1))

  const getTasksForDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return tasks.filter(t => t.due_date && t.due_date.split('T')[0] === dateStr)
  }

  const isToday = (day) => {
    return today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
  }

  const isPast = (day) => {
    const date = new Date(year, month, day)
    return date < new Date(today.getFullYear(), today.getMonth(), today.getDate())
  }

  const selectedDayTasks = selectedDay ? getTasksForDay(selectedDay) : []

  const upcomingTasks = tasks
    .filter(t => {
      if (!t.due_date || t.status === 'done') return false
      return new Date(t.due_date) >= new Date()
    })
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 8)

  const statusColor = {
    todo: 'bg-textsecondary',
    in_progress: 'bg-warning',
    for_review: 'bg-primary',
    done: 'bg-success',
    blocked: 'bg-danger',
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
    <div className="flex flex-col lg:flex-row gap-6">

      {/* Calendar */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-medium text-textprimary">Calendar</h2>
            <p className="text-textsecondary text-sm mt-1">
              {MONTHS[month]} {year}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-textsecondary hover:text-textprimary hover:bg-surface transition-colors"
            >
              <i className="ti ti-chevron-left text-sm" aria-hidden="true"></i>
            </button>
            <button
              onClick={() => setCurrent(new Date())}
              className="btn btn-outline"
            >
              Today
            </button>
            <button
              onClick={nextMonth}
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-textsecondary hover:text-textprimary hover:bg-surface transition-colors"
            >
              <i className="ti ti-chevron-right text-sm" aria-hidden="true"></i>
            </button>
          </div>
        </div>

        {/* Calendar grid */}
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-border">
            {DAYS.map(d => (
              <div key={d} className="py-3 text-center text-textsecondary text-xs font-medium">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7">
            {/* Empty cells before first day */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="min-h-16 md:min-h-20 border-b border-r border-border p-2 bg-background opacity-40" />
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const dayTasks = getTasksForDay(day)
              const isSelected = selectedDay === day
              const todayCell = isToday(day)
              const pastDay = isPast(day)

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(isSelected ? null : day)}
                  className={`min-h-16 md:min-h-20 border-b border-r border-border p-2 cursor-pointer transition-colors ${
                    isSelected ? 'bg-primary/10' :
                    todayCell ? 'bg-primary/10' :
                    pastDay ? 'bg-background opacity-60' :
                    'hover:bg-background'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium mb-1 ${
                    todayCell
                      ? 'bg-primary text-white'
                      : 'text-textprimary'
                  }`}>
                    {day}
                  </div>
                  <div className="space-y-0.5">
                    {dayTasks.slice(0, 2).map(t => (
                      <div
                        key={t.id}
                        className={`text-xs px-1 py-0.5 rounded truncate ${
                          t.status === 'done' ? 'text-success bg-success/10' :
                          t.status === 'blocked' ? 'text-danger bg-danger/10' :
                          'text-primary bg-primary/10'
                        }`}
                      >
                        {t.title}
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <div className="text-xs text-textsecondary pl-1">
                        +{dayTasks.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Selected day tasks */}
        {selectedDay && (
          <div className="mt-4 card">
            <h4 className="text-textprimary text-sm font-medium mb-3">
              {MONTHS[month]} {selectedDay} — {selectedDayTasks.length} task{selectedDayTasks.length !== 1 ? 's' : ''}
            </h4>
            {selectedDayTasks.length === 0 ? (
              <p className="text-textsecondary text-sm">No tasks due on this day.</p>
            ) : (
              <div className="space-y-2">
                {selectedDayTasks.map(t => (
                  <div key={t.id} className="flex items-center gap-3 bg-background rounded-lg px-3 py-2.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${statusColor[t.status]}`}></div>
                    <span className="text-textprimary text-sm flex-1">{t.title}</span>
                    <Link
                      to={`/projects/${t.project_id}`}
                      className="text-primary text-xs hover:underline"
                    >
                      {t.project_name}
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sidebar — upcoming tasks */}
      <div className="w-full lg:w-64 flex-shrink-0">
        <h3 className="text-textprimary text-sm font-medium mb-4">Upcoming tasks</h3>
        {upcomingTasks.length === 0 ? (
          <div className="card text-center">
            <i className="ti ti-calendar-check text-textsecondary text-xl mb-2 block" aria-hidden="true"></i>
            <p className="text-textsecondary text-xs">No upcoming tasks</p>
          </div>
        ) : (
          <div className="space-y-2">
            {upcomingTasks.map(t => (
              <div
                key={t.id}
                className="card cursor-pointer hover:border-primary transition-colors"
                onClick={() => {
                  const date = new Date(t.due_date)
                  if (date.getMonth() === month && date.getFullYear() === year) {
                    setSelectedDay(date.getDate())
                  } else {
                    setCurrent(new Date(date.getFullYear(), date.getMonth(), 1))
                    setSelectedDay(date.getDate())
                  }
                }}
              >
                <p className="text-textprimary text-xs font-medium truncate mb-1">{t.title}</p>
                <div className="flex items-center justify-between">
                  <span className="text-textsecondary text-xs">{t.project_name}</span>
                  <span className="text-textsecondary text-xs flex items-center gap-1">
                    <i className="ti ti-calendar text-xs" aria-hidden="true"></i>
                    {new Date(t.due_date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}