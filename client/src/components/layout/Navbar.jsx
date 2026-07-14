import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import NotificationBell from './NotificationBell'
import ThemeToggle from './ThemeToggle'

export default function Navbar({ title, subtitle }) {
  const { user } = useAuth()

  const initials = user?.full_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="h-14 bg-surface border-b border-border flex items-center justify-between px-4 md:px-6 flex-shrink-0">
      <div className="min-w-0">
        <h1 className="text-textprimary text-sm font-medium truncate">{title}</h1>
        {subtitle && <p className="text-textsecondary text-xs truncate">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <NotificationBell />
        <Link
          to="/profile"
          className="md:hidden w-8 h-8 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 bg-primary/20"
          aria-label="Profile"
        >
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt={user.full_name} className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <span className="text-primary text-xs font-medium">{initials}</span>
          )}
        </Link>
      </div>
    </header>
  )
}
