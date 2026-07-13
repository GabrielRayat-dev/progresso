import { useState } from 'react'

export default function Navbar({ title, subtitle }) {
  const [notifOpen, setNotifOpen] = useState(false)

  return (
    <header className="h-14 bg-surface border-b border-border flex items-center justify-between px-6 flex-shrink-0">
      <div>
        <h1 className="text-textprimary text-sm font-medium">{title}</h1>
        {subtitle && <p className="text-textsecondary text-xs">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setNotifOpen(!notifOpen)}
          className="relative w-8 h-8 rounded-lg flex items-center justify-center text-textsecondary hover:text-textprimary hover:bg-background transition-colors"
        >
          <i className="ti ti-bell text-base" aria-hidden="true"></i>
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
        </button>
      </div>
    </header>
  )
}