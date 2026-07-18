import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from '../components/layout/ThemeToggle'
import { navIcons } from '../constants/navIcons'

// Blocky pixel speech-bubble used to represent "comments" in the gamified board.
function PixelComment({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 16 16" className={`${className} pixel-img`} aria-hidden="true" fill="currentColor">
      <rect x="2" y="2" width="12" height="9" />
      <rect x="4" y="11" width="3" height="2" />
      <rect x="11" y="4" width="1" height="1" fill="var(--color-background)" />
      <rect x="11" y="6" width="1" height="1" fill="var(--color-background)" />
      <rect x="4" y="4" width="6" height="1" fill="var(--color-background)" />
      <rect x="4" y="6" width="4" height="1" fill="var(--color-background)" />
      <rect x="4" y="8" width="5" height="1" fill="var(--color-background)" />
    </svg>
  )
}

// Color-coded status chip — the "statuses" element of the gamified board.
const STATUS_STYLES = {
  DONE: 'text-success bg-success/15',
  DOING: 'text-warning bg-warning/15',
  BLOCKED: 'text-danger bg-danger/15',
}
function StatusChip({ status }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 font-pixel text-[10px] uppercase border-2 border-border flex-shrink-0 ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  )
}

const boardTasks = [
  { title: 'Backend API', status: 'DONE', comments: 4 },
  { title: 'UI wireframes', status: 'DOING', comments: 2 },
  { title: 'Deploy staging', status: 'BLOCKED', comments: 1 },
]

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  // Looping "level-up" bar in the dashboard (RetroBar) style. The segmented
  // pixel fill snaps between discrete steps — 30% → 70% → 100% — holds at each,
  // then resets to 0% and loops. The percentage label shows inside the bar only
  // once it lands on a step (never mid-transition, never at 0%).
  // Start the label at 30% so there's a value on first paint. The label is
  // never cleared, so the reserved space below stays locked and the user
  // always sees a value (30 / 70 / 100) — even mid-animation.
  const [progress, setProgress] = useState(0)
  const [label, setLabel] = useState('30%')
  useEffect(() => {
    const timers = []
    const wait = (ms) => new Promise((resolve) => {
      const id = setTimeout(resolve, ms)
      timers.push(id)
    })
    let cancelled = false
    const PHASES = [
      { value: 30, hold: 2400 },  // animate to 30%, hold
      { value: 70, hold: 2400 },  // animate to 70%, hold
      { value: 100, hold: 2320 }, // animate to 100%, hold briefly
      { value: 0, hold: 800 },    // reset to empty (label keeps the last milestone)
    ]
    const loop = async () => {
      while (!cancelled) {
        for (const phase of PHASES) {
          if (cancelled) return
          // Snap the label to the upcoming value right away so it's never
          // blank; during the reset we keep the previous milestone instead
          // of flashing an empty/zero label.
          if (phase.value !== 0) setLabel(`${phase.value}%`)
          setProgress(phase.value)
          await wait(520)         // let the width transition run (duration-500)
          if (cancelled) return
          await wait(phase.hold)  // hold at the step / reset pause
        }
      }
    }
    loop()
    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [])

  // Segmented pixel fill + tier color, identical to the dashboard RetroBar:
  //   0–33%  low    → danger red
  //   34–74% medium → warning yellow/orange
  //   75–100 high   → active theme accent
  const tierColor =
    progress <= 33 ? 'var(--color-danger)' :
    progress <= 74 ? 'var(--color-warning)' :
    'var(--color-primary)'
  const segment = `repeating-linear-gradient(90deg, ${tierColor} 0, ${tierColor} 10px, rgba(0,0,0,0.18) 10px, rgba(0,0,0,0.18) 12px)`

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
      <div className="sticky top-0 z-50 bg-background border-b-[3px] border-border">
        <nav className="flex items-center justify-between px-4 md:px-8 py-3 md:py-4 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-2">
            <img src={navIcons.logo} alt="Progresso logo" className="h-8 w-8 object-contain flex-shrink-0" />
            <span className="font-pixel text-textprimary text-base uppercase tracking-wide">Progresso</span>
          </Link>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link to="/login" className="btn btn-ghost">Sign in</Link>
            <Link to="/register" className="btn btn-primary">Get started free</Link>
          </div>

          {/* Mobile hamburger menu */}
          <div className="relative md:hidden" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="w-9 h-9 border-[3px] border-border shadow-retro flex items-center justify-center text-textsecondary hover:bg-black hover:text-white active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-transform"
            >
              <i className={`ti ${menuOpen ? 'ti-x' : 'ti-menu-2'} text-lg`} aria-hidden="true"></i>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 pixel-card-retro py-2 z-50">
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
                  className="block px-4 py-2.5 text-primary font-medium hover:bg-background transition-colors"
                >
                  Get started free
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-16 pb-12 max-w-5xl mx-auto">
        <h1 className="font-pixel text-2xl sm:text-3xl md:text-4xl text-textprimary max-w-2xl leading-snug mb-5">
          Stop chasing teammates.
          <span className="text-primary block mt-2">Start tracking progress.</span>
        </h1>

        <p className="font-mono text-textsecondary text-sm sm:text-base max-w-lg leading-relaxed mb-7">
          Progresso keeps your whole team aligned — tasks, statuses, comments,
          and activity logs in one place. No more &ldquo;anong progress mo?&rdquo; in the group chat.
        </p>

        {/* Level-up progress bar — dashboard RetroBar style, step-based loop */}
        <div className="w-full max-w-xs mb-8">
          <div
            className="relative h-5 w-full border-[3px] border-border bg-surface overflow-hidden pixel-corners-sm"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full transition-[width] duration-500"
              style={{ width: `${progress}%`, backgroundImage: segment }}
            />
          </div>
          {/* Percentage label — fixed-height container so it never shifts layout;
              the text content still updates only at the 30/70/100 steps */}
          <p className="font-pixel text-xs text-black dark:text-white mt-1 text-center h-4 leading-4">
            {label}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/register" className="btn btn-primary btn-lg">
            <i className="ti ti-rocket" aria-hidden="true"></i>
            Create free account
          </Link>
          <Link to="/login" className="btn btn-outline btn-lg">Sign in</Link>
        </div>

        <p className="font-pixel text-[10px] uppercase text-textsecondary mt-4">
          Free forever · No credit card required
        </p>
      </section>

      {/* Gamified project board — tasks, statuses & comments as pixel elements */}
      <section className="px-6 pb-16 max-w-2xl mx-auto">
        <div className="card-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-pixel text-xs uppercase text-textprimary">Project board · Thesis</h3>
            <span className="font-pixel text-[10px] uppercase text-textsecondary">3 tasks</span>
          </div>
          <div className="space-y-2">
            {boardTasks.map((t) => (
              <div
                key={t.title}
                className="flex items-center gap-3 border-[3px] border-border bg-surface shadow-retro px-3 py-3"
              >
                <img src={navIcons.task} alt="" aria-hidden="true" className="w-6 h-6 pixel-img flex-shrink-0" />
                <p className="font-mono text-sm text-textprimary truncate flex-1 text-left">{t.title}</p>
                <span className="flex items-center gap-1 text-textsecondary flex-shrink-0">
                  <PixelComment className="w-4 h-4" />
                  <span className="font-pixel text-[10px]">{t.comments}</span>
                </span>
                <StatusChip status={t.status} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pain point section */}
      <section className="px-8 py-12 max-w-4xl mx-auto">
        <div className="card-lg mb-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 border-[3px] border-border shadow-retro flex items-center justify-center flex-shrink-0 bg-danger/10">
              <i className="ti ti-mood-sad text-danger text-lg" aria-hidden="true"></i>
            </div>
            <div>
              <h3 className="font-pixel text-sm uppercase text-textprimary mb-1">Sound familiar?</h3>
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
              <div key={i} className="flex items-center gap-3 bg-surface border-[3px] border-border shadow-retro px-4 py-3">
                <i className="ti ti-message-circle text-textsecondary text-sm flex-shrink-0" aria-hidden="true"></i>
                <span className="text-textsecondary text-sm italic">{msg}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card-lg border-primary">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 border-[3px] border-border shadow-retro flex items-center justify-center flex-shrink-0 bg-primary/10">
              <i className="ti ti-circle-check text-primary text-lg" aria-hidden="true"></i>
            </div>
            <div>
              <h3 className="font-pixel text-sm uppercase text-textprimary mb-1">Progresso fixes this.</h3>
              <p className="text-textsecondary text-sm">Everything your team needs in one place.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { icon: 'ti-checkbox', text: 'Task statuses updated in one click' },
              { icon: 'ti-activity', text: 'Activity log shows who did what' },
              { icon: 'ti-message', text: 'Comments per task, not in group chat' },
              { icon: 'ti-alert-triangle', text: 'Blocked status so leaders know instantly' },
              { icon: 'ti-chart-bar', text: 'Analytics dashboard per project' },
              { icon: 'ti-clock', text: 'Last updated timestamp on every task' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-surface border-[3px] border-border shadow-retro px-4 py-3">
                <i className={`ti ${item.icon} text-primary text-sm flex-shrink-0`} aria-hidden="true"></i>
                <span className="text-textsecondary text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-8 py-12 max-w-4xl mx-auto">
        <h2 className="font-pixel text-xl uppercase text-textprimary text-center mb-3">
          How it works
        </h2>
        <p className="text-textsecondary text-center text-sm mb-10">
          Three steps from chaos to clarity.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: 'Step 1', icon: navIcons.folder, title: 'Create your project', desc: 'Spin up a project, pick its type, and invite your team by email in seconds.' },
            { step: 'Step 2', icon: navIcons.analytics, title: 'Track every task', desc: 'Assign tasks, update statuses in one click, and watch the progress bar fill as work gets done.' },
            { step: 'Step 3', icon: navIcons.bell, title: 'Stay in sync', desc: 'Get notified on comments, assignments, and deadlines — no more digging through group chat.' },
          ].map((s, i) => (
            <div key={i} className="card text-center">
              <div className="w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <img src={s.icon} alt="" aria-hidden="true" className="w-7 h-7 pixel-img" />
              </div>
              <div className="font-pixel text-[10px] uppercase text-primary mb-1">{s.step}</div>
              <h4 className="font-pixel text-xs uppercase text-textprimary mb-2">{s.title}</h4>
              <p className="text-textsecondary text-xs leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-8 py-12 max-w-4xl mx-auto">
        <h2 className="font-pixel text-xl uppercase text-textprimary text-center mb-3">
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
              <div className={`w-9 h-9 border-[3px] border-border shadow-retro flex items-center justify-center mb-4 ${f.bg}`} style={{ color: f.color }}>
                <i className={`ti ${f.icon} text-base`} aria-hidden="true"></i>
              </div>
              <h4 className="font-pixel text-xs uppercase text-textprimary mb-2">{f.title}</h4>
              <p className="text-textsecondary text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Project types */}
      <section className="px-8 py-12 max-w-4xl mx-auto">
        <h2 className="font-pixel text-xl uppercase text-textprimary text-center mb-3">
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
              <div className={`w-10 h-10 border-[3px] border-border shadow-retro flex items-center justify-center mx-auto mb-3 ${t.bg}`} style={{ color: t.color }}>
                <i className={`ti ${t.icon} text-base`} aria-hidden="true"></i>
              </div>
              <div className="font-pixel text-[10px] uppercase mb-1" style={{ color: t.color }}>{t.label}</div>
              <div className="text-xs text-textsecondary">{t.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-12 max-w-4xl mx-auto text-center">
        <div className="card-lg max-w-2xl mx-auto">
          <h2 className="font-pixel text-xl uppercase text-textprimary mb-3">
            Ready to move forward?
          </h2>
          <p className="text-textsecondary text-sm mb-8">
            Create your free account and invite your team in minutes.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg">
            <i className="ti ti-rocket" aria-hidden="true"></i>
            Get started — it's free
          </Link>
          <p className="text-xs text-textsecondary mt-4">
            No credit card · No setup · Just create and go
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-[3px] border-border px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-2">
            <img src={navIcons.logo} alt="Progresso logo" className="h-6 w-6 object-contain flex-shrink-0" />
            <span className="font-pixel text-textprimary text-sm uppercase tracking-wide">Progresso</span>
          </Link>
          <a
            href="https://portfolio-gabriel-rayat.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-textsecondary text-center hover:text-primary transition-colors"
          >
            Built by Gabriel Rayat – BSCS 3rd year
          </a>
          <p className="text-xs text-textsecondary text-center">
            Move forward, together.
          </p>
        </div>
      </footer>

    </div>
  )
}
