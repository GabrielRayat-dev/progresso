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
    <aside className="hidden md:flex w-56 h-screen bg-background border-r-[3px] border-border flex-col flex-shrink-0 px-3 py-3 space-y-3">

      {/* Logo */}
      <div className="flex items-center gap-2 px-2 py-4 border-b-[3px] border-border">
        <div className="w-8 h-8 border-[3px] border-border bg-primary flex items-center justify-center flex-shrink-0 shadow-retro">
          <i className="ti ti-chart-bar text-black text-xs" aria-hidden="true"></i>
        </div>
        <span className="font-pixel text-black text-[11px] uppercase tracking-wide">Progresso</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 font-pixel text-xs uppercase tracking-wide border-[3px] border-border shadow-retro transition-transform ${
                isActive
                  ? 'bg-primary text-black'
                  : 'bg-surface text-textprimary hover:bg-black hover:text-white'
              } active:translate-x-[4px] active:translate-y-[4px] active:shadow-none`}
            >
              <i className={`ti ${item.icon} text-base flex-shrink-0`} aria-hidden="true"></i>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 py-4 border-t-[3px] border-border space-y-2">
        <Link
          to="/profile"
          className={`flex items-center gap-3 px-4 py-2.5 font-pixel text-xs uppercase tracking-wide border-[3px] border-border shadow-retro transition-transform ${
            location.pathname === '/profile'
              ? 'bg-primary text-black'
              : 'bg-surface text-textprimary hover:bg-black hover:text-white'
          } active:translate-x-[4px] active:translate-y-[4px] active:shadow-none`}
        >
          <i className="ti ti-settings text-base flex-shrink-0" aria-hidden="true"></i>
          <span>Settings</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 font-pixel text-xs uppercase tracking-wide text-danger border-[3px] border-border bg-surface shadow-retro transition-transform hover:bg-danger hover:text-white active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
        >
          <i className="ti ti-logout text-base flex-shrink-0" aria-hidden="true"></i>
          <span>Sign out</span>
        </button>
      </div>

      {/* User */}
      <div className="px-2 py-4 border-t-[3px] border-border">
        <Link
          to="/profile"
          className={`flex items-center gap-3 hover:bg-surface transition-colors border-[3px] border-border bg-surface px-2 py-1.5 shadow-retro ${
            location.pathname === '/profile' ? 'bg-primary' : ''
          }`}
        >
          <div
            className="w-8 h-8 border-[3px] border-border bg-primary flex items-center justify-center flex-shrink-0 overflow-hidden"
          >
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={user.full_name} className="w-8 h-8 object-cover" />
            ) : (
              <span className="text-black text-xs font-pixel">{initials}</span>
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