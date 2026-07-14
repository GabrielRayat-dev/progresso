import NotificationBell from './NotificationBell'

export default function Navbar({ title, subtitle }) {
  return (
    <header className="h-14 bg-surface border-b border-border flex items-center justify-between px-6 flex-shrink-0">
      <div>
        <h1 className="text-textprimary text-sm font-medium">{title}</h1>
        {subtitle && <p className="text-textsecondary text-xs">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        <NotificationBell />
      </div>
    </header>
  )
}
