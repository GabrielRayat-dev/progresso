import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import NotificationBell from './NotificationBell'
import ThemeToggle from './ThemeToggle'

export default function Navbar({ title, subtitle }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const initials = user?.full_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  // Close the dropdown on outside click or Escape
  useEffect(() => {
    if (!menuOpen) return
    const onPointer = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="h-14 bg-surface border-b-[3px] border-border flex items-center justify-between px-4 md:px-6 flex-shrink-0">
      <div className="min-w-0">
        <h1 className="text-textprimary font-pixel text-xs uppercase tracking-wide truncate">{title}</h1>
        {subtitle && <p className="text-textsecondary text-xs truncate">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <NotificationBell />

        {/* Avatar dropdown — opens Settings / Sign out on tap (mobile + desktop) */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="Account menu"
            className="w-8 h-8 border-[3px] border-border bg-primary flex items-center justify-center overflow-hidden flex-shrink-0 shadow-retro hover:bg-black transition-colors"
          >
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={user.full_name} className="w-8 h-8 object-cover" />
            ) : (
              <span className="text-black text-xs font-pixel">{initials}</span>
            )}
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-52 card shadow-retro py-1 z-50"
            >
              <div className="px-4 py-2.5 border-b-[3px] border-border min-w-0">
                <p className="text-textprimary text-xs font-medium truncate">{user?.full_name}</p>
                <p className="text-textsecondary text-xs truncate">{user?.email}</p>
              </div>
              <Link
                to="/profile"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-textsecondary hover:text-textprimary hover:bg-black hover:text-white transition-colors"
              >
                <i className="ti ti-settings text-base flex-shrink-0" aria-hidden="true"></i>
                <span>Settings</span>
              </Link>
              <button
                onClick={handleLogout}
                role="menuitem"
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-textsecondary hover:text-danger transition-colors"
              >
                <i className="ti ti-logout text-base flex-shrink-0" aria-hidden="true"></i>
                <span>Sign out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
