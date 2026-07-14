import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from '../components/layout/ThemeToggle'

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // Close the mobile menu on outside click or Escape
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

  return (
    <div className="min-h-screen bg-background text-textprimary">

      {/* Navbar */}
      <div className="sticky top-0 z-50 bg-background border-b border-border">
        <nav className="flex items-center justify-between px-4 md:px-8 py-4 md:py-5 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <i className="ti ti-chart-bar text-white text-sm" aria-hidden="true"></i>
            </div>
            <span className="font-medium text-lg text-textprimary">Progresso</span>
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/login"
              className="btn btn-ghost"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="btn btn-primary"
            >
              Get started free
            </Link>
          </div>

          {/* Mobile hamburger menu */}
          <div className="relative md:hidden" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-textsecondary hover:text-textprimary hover:bg-surface transition-colors"
            >
              <i className={`ti ${menuOpen ? 'ti-x' : 'ti-menu-2'} text-lg`} aria-hidden="true"></i>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-surface shadow-lg py-2 z-50">
                <div className="flex items-center justify-between px-4 py-2 border-b border-border">
                  <span className="text-textsecondary text-sm">Theme</span>
                  <ThemeToggle />
                </div>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm text-textprimary hover:bg-background transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm text-primary font-medium hover:bg-background transition-colors"
                >
                  Get started free
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-20 pb-16 max-w-4xl mx-auto">
        <div className="pill bg-surface border border-border text-textsecondary mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-success"></div>
          Built for Filipino students and dev teams
        </div>

        <h1 className="text-4xl font-medium text-textprimary max-w-2xl leading-tight mb-6">
          Stop chasing teammates.
          <span className="text-primary"> Start tracking progress.</span>
        </h1>

        <p className="text-textsecondary text-base max-w-lg leading-relaxed mb-10">
          Progresso keeps your whole team aligned — tasks, statuses, comments,
          and activity logs in one place. No more "anong progress mo?" in the group chat.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/register"
            className="btn btn-primary btn-lg"
          >
            <i className="ti ti-rocket" aria-hidden="true"></i>
            Create free account
          </Link>
          <Link
            to="/login"
            className="btn btn-outline btn-lg"
          >
            Sign in
          </Link>
        </div>

        <p className="text-xs text-textsecondary mt-4">
          Free forever · No credit card required
        </p>
      </section>

      {/* Pain point section */}
      <section className="px-8 py-12 max-w-4xl mx-auto">
        <div className="card-lg mb-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-danger/10">
              <i className="ti ti-mood-sad text-danger text-lg" aria-hidden="true"></i>
            </div>
            <div>
              <h3 className="text-textprimary font-medium mb-1">Sound familiar?</h3>
              <p className="text-textsecondary text-sm">Every group project goes through this.</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              '"Anong part na ang ginawa mo?"',
              '"Hindi ko alam kung tapos na yung backend."',
              '"Bakit blocked yung task ko? Sino ang dapat mag-finish ng API?"',
              '"Sino nag-update ng deadline? Hindi ko nakita sa chat."',
            ].map((msg, i) => (
              <div key={i} className="flex items-center gap-3 bg-background rounded-lg px-4 py-3">
                <i className="ti ti-message-circle text-textsecondary text-sm flex-shrink-0" aria-hidden="true"></i>
                <span className="text-textsecondary text-sm italic">{msg}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card-lg border-primary border-opacity-40">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary/10">
              <i className="ti ti-circle-check text-primary text-lg" aria-hidden="true"></i>
            </div>
            <div>
              <h3 className="text-textprimary font-medium mb-1">Progresso fixes this.</h3>
              <p className="text-textsecondary text-sm">Everything your team needs in one place.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: 'ti-checkbox', text: 'Task statuses updated in one click' },
              { icon: 'ti-activity', text: 'Activity log shows who did what' },
              { icon: 'ti-message', text: 'Comments per task, not in group chat' },
              { icon: 'ti-alert-triangle', text: 'Blocked status so leaders know instantly' },
              { icon: 'ti-chart-bar', text: 'Analytics dashboard per project' },
              { icon: 'ti-clock', text: 'Last updated timestamp on every task' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-background rounded-lg px-4 py-3">
                <i className={`ti ${item.icon} text-primary text-sm flex-shrink-0`} aria-hidden="true"></i>
                <span className="text-textsecondary text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-8 py-12 max-w-4xl mx-auto">
        <h2 className="text-2xl font-medium text-textprimary text-center mb-3">
          Everything your team needs
        </h2>
        <p className="text-textsecondary text-center text-sm mb-10">
          Built specifically for students and small dev teams — not corporate giants.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: 'ti-folder', color: '#6C63FF', bg: 'bg-primary/10', title: 'Project types', desc: 'Tag projects as Thesis, School, Freelance, or Personal. Filter and organize by type.' },
            { icon: 'ti-users', color: '#4ECDC4', bg: 'bg-secondary/10', title: 'Team roles', desc: 'Leader, Member, and Viewer roles per project. Invite teammates by email.' },
            { icon: 'ti-activity', color: '#2ECC71', bg: 'bg-success/10', title: 'Activity logs', desc: 'Every action logged automatically. See who changed what and when.' },
            { icon: 'ti-message', color: '#F39C12', bg: 'bg-warning/10', title: 'Task comments', desc: 'Leave comments directly on tasks. No more hunting for updates in group chats.' },
            { icon: 'ti-chart-bar', color: '#6C63FF', bg: 'bg-primary/10', title: 'Analytics', desc: 'Charts for task completion, member progress, and project health.' },
            { icon: 'ti-bell', color: '#E74C3C', bg: 'bg-danger/10', title: 'Notifications', desc: 'Get notified when assigned, commented on, or when deadlines are near.' },
          ].map((f, i) => (
            <div key={i} className="card hover:border-primary transition-colors">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-4 ${f.bg}`} style={{ color: f.color }}>
                <i className={`ti ${f.icon} text-base`} aria-hidden="true"></i>
              </div>
              <h4 className="text-textprimary font-medium text-sm mb-2">{f.title}</h4>
              <p className="text-textsecondary text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Project types */}
      <section className="px-8 py-12 max-w-4xl mx-auto">
        <h2 className="text-2xl font-medium text-textprimary text-center mb-3">
          Made for every type of project
        </h2>
        <p className="text-textsecondary text-center text-sm mb-10">
          From thesis to freelance work — Progresso has you covered.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Thesis / Capstone', icon: 'ti-school', color: '#6C63FF', bg: 'bg-primary/10', desc: 'Track chapters, defenses, and research tasks' },
            { label: 'School Subject', icon: 'ti-book', color: '#4ECDC4', bg: 'bg-secondary/10', desc: 'Group activities and requirements' },
            { label: 'Freelance / Client', icon: 'ti-briefcase', color: '#EF9F27', bg: 'bg-warning/10', desc: 'Client deliverables and milestones' },
            { label: 'Personal / Side', icon: 'ti-heart', color: '#2ECC71', bg: 'bg-success/10', desc: 'Personal goals and side projects' },
          ].map((t, i) => (
            <div key={i} className="card text-center hover:border-primary transition-colors">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3 ${t.bg}`} style={{ color: t.color }}>
                <i className={`ti ${t.icon} text-base`} aria-hidden="true"></i>
              </div>
              <div className="text-xs font-medium mb-1" style={{ color: t.color }}>{t.label}</div>
              <div className="text-xs text-textsecondary">{t.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-12 max-w-4xl mx-auto text-center">
        <div className="card-lg max-w-2xl mx-auto">
          <h2 className="text-2xl font-medium text-textprimary mb-3">
            Ready to move forward?
          </h2>
          <p className="text-textsecondary text-sm mb-8">
            Create your free account and invite your team in minutes.
          </p>
          <Link
            to="/register"
            className="btn btn-primary btn-lg"
          >
            <i className="ti ti-rocket" aria-hidden="true"></i>
            Get started — it's free
          </Link>
          <p className="text-xs text-textsecondary mt-4">
            No credit card · No setup · Just create and go
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-8 py-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <i className="ti ti-chart-bar text-white text-xs" aria-hidden="true"></i>
            </div>
            <span className="text-sm font-medium text-textprimary">Progresso</span>
          </div>
          <p className="text-xs text-textsecondary">
            Built by Gabriel Rayat · BSCS 3rd year
          </p>
          <p className="text-xs text-textsecondary">
            Move forward, together.
          </p>
        </div>
      </footer>

    </div>
  )
}