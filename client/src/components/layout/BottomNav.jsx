import { Link, useLocation } from 'react-router-dom'

const navItems = [
  { icon: 'ti-layout-dashboard', label: 'Home', path: '/dashboard' },
  { icon: 'ti-folder', label: 'Projects', path: '/projects' },
  { icon: 'ti-checkbox', label: 'Tasks', path: '/tasks' },
  { icon: 'ti-chart-bar', label: 'Stats', path: '/analytics' },
  { icon: 'ti-calendar', label: 'Calendar', path: '/calendar' },
]

export default function BottomNav() {
  const location = useLocation()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface border-t border-border flex items-stretch z-40">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex-1 flex flex-col items-center justify-center gap-1 text-[11px] transition-colors ${
              isActive ? 'text-primary' : 'text-textsecondary'
            }`}
          >
            <i className={`ti ${item.icon} text-lg`} aria-hidden="true"></i>
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
