import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { icon: 'ti-layout-dashboard', label: 'Dashboard', path: '/dashboard' },
  { icon: 'ti-folder', label: 'Projects', path: '/projects' },
  { icon: 'ti-checkbox', label: 'My tasks', path: '/tasks' },
  { icon: 'ti-chart-bar', label: 'Analytics', path: '/analytics' },
  { icon: 'ti-calendar', label: 'Calendar', path: '/calendar' },
]

export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const initials = user?.full_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <aside className="w-56 h-screen bg-surface border-r border-border flex flex-col flex-shrink-0 px-3 py-3 space-y-3">

      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-border">
        <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
          <i className="ti ti-chart-bar text-white text-xs" aria-hidden="true"></i>
        </div>
        <span className="font-medium text-textprimary text-sm">Progresso</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              style={isActive ? { background: '#1E1A3F' } : undefined}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'text-primary font-medium'
                  : 'text-textsecondary hover:text-textprimary hover:bg-background'
              }`}
            >
              <i className={`ti ${item.icon} text-base flex-shrink-0`} aria-hidden="true"></i>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-4 py-4 border-t border-border space-y-1">
        <Link
          to="/profile"
          style={location.pathname === '/profile' ? { background: '#1E1A3F' } : undefined}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
            location.pathname === '/profile'
              ? 'text-primary font-medium'
              : 'text-textsecondary hover:text-textprimary hover:bg-background'
          }`}
        >
          <i className="ti ti-settings text-base flex-shrink-0" aria-hidden="true"></i>
          <span>Settings</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-textsecondary hover:text-danger hover:bg-background transition-colors"
        >
          <i className="ti ti-logout text-base flex-shrink-0" aria-hidden="true"></i>
          <span>Sign out</span>
        </button>
      </div>

      {/* User */}
      <div className="px-4 py-4 border-t border-border">
        <Link
          to="/profile"
          style={location.pathname === '/profile' ? { background: '#1E1A3F' } : undefined}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity rounded-lg px-2 py-1.5"
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
            style={{ background: 'rgba(108, 99, 255, 0.2)' }}
          >
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={user.full_name} className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <span className="text-primary text-xs font-medium">{initials}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-textprimary text-xs font-medium truncate">{user?.full_name}</p>
            <p className="text-textsecondary text-xs truncate">{user?.email}</p>
          </div>
        </Link>
      </div>

    </aside>
  )
}