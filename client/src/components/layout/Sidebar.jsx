import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { navIcons } from '../../constants/navIcons'

const COLLAPSE_KEY = 'sidebarCollapsed'

const navItems = [
  { icon: navIcons.dashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: navIcons.folder, label: 'Projects', path: '/projects' },
  { icon: navIcons.task, label: 'My tasks', path: '/tasks' },
  { icon: navIcons.analytics, label: 'Analytics', path: '/analytics' },
  { icon: navIcons.calendar, label: 'Calendar', path: '/calendar' },
]

function readCollapsed() {
  try {
    return localStorage.getItem(COLLAPSE_KEY) === '1'
  } catch (e) {
    return false
  }
}

// Single nav link: clean row, dynamic accent on hover/active, and a blocky
// vertical active indicator strip pinned to the absolute left edge.
function NavLink({ item, isActive, collapsed }) {
  return (
    <Link
      to={item.path}
      title={collapsed ? item.label : undefined}
      aria-current={isActive ? 'page' : undefined}
      className={`group relative flex items-center gap-3 px-4 py-2.5 font-pixel text-xs uppercase tracking-wide transition-colors duration-200 ${
        collapsed ? 'justify-center px-0' : ''
      } ${
        isActive
          ? 'text-primary'
          : 'text-textprimary hover:text-primary'
      }`}
    >
      {isActive && (
        <span
          aria-hidden="true"
          className="absolute left-0 top-1 bottom-1 w-[5px] bg-primary"
        />
      )}
      <img
        src={item.icon}
        alt=""
        aria-hidden="true"
        className="w-6 h-6 pixel-img flex-shrink-0"
      />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  )
}

export default function Sidebar() {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(readCollapsed)

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev
      try { localStorage.setItem(COLLAPSE_KEY, next ? '1' : '0') } catch (e) {}
      return next
    })
  }

  const profileActive = location.pathname === '/profile'

  return (
    <aside
      className={`hidden md:flex h-screen flex-col flex-shrink-0 bg-background border-r-[3px] border-border transition-[width] duration-200 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* Top bar: branding (hidden when collapsed) + retro collapse toggle */}
      <div
        className={`flex items-center h-14 border-b-[3px] border-border ${
          isCollapsed ? 'justify-center px-0' : 'justify-between px-3'
        }`}
      >
        {!isCollapsed && (
          <Link to="/dashboard" className="flex items-center gap-2 min-w-0">
            <img
              src={navIcons.logo}
              alt="Progresso logo"
              className="h-8 w-8 object-contain flex-shrink-0"
            />
            <span className="font-pixel text-textprimary text-sm uppercase tracking-wide truncate">
              Progresso
            </span>
          </Link>
        )}
        <button
          onClick={toggleCollapse}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!isCollapsed}
          className="w-8 h-8 flex items-center justify-center border-[3px] border-border bg-surface text-textprimary font-pixel text-sm rounded-lg shadow-retro transition-transform hover:bg-black hover:text-white active:translate-x-[4px] active:translate-y-[4px] active:shadow-none flex-shrink-0"
        >
          {isCollapsed ? '»' : '«'}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            item={item}
            collapsed={isCollapsed}
            isActive={location.pathname === item.path}
          />
        ))}
      </nav>

      {/* Bottom: Settings action only */}
      <div className="space-y-1 border-t-[3px] border-border py-2">
        <NavLink
          item={{ icon: navIcons.settings, label: 'Settings', path: '/profile' }}
          collapsed={isCollapsed}
          isActive={profileActive}
        />
      </div>

      {/* System footer — version + copyright, aligned to the link grid */}
      {!isCollapsed && (
        <div className="border-t-[3px] border-border px-4 py-3">
          <p className="font-mono text-xs uppercase text-textsecondary truncate">
            v1.0.0 • © 2026 Progresso
          </p>
        </div>
      )}
    </aside>
  )
}

