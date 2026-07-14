import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-textprimary">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-border max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <i className="ti ti-chart-bar text-white text-sm" aria-hidden="true"></i>
          </div>
          <span className="font-medium text-lg text-textprimary">Progresso</span>
        </div>
        <div className="flex items-center gap-3">
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
      </nav>

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

        <div className="flex items-center gap-4">
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
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#2A0A0A' }}>
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
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#1E1A3F' }}>
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
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: 'ti-folder', color: '#6C63FF', bg: '#1E1A3F', title: 'Project types', desc: 'Tag projects as Thesis, School, Freelance, or Personal. Filter and organize by type.' },
            { icon: 'ti-users', color: '#4ECDC4', bg: '#0A2A2A', title: 'Team roles', desc: 'Leader, Member, and Viewer roles per project. Invite teammates by email.' },
            { icon: 'ti-activity', color: '#2ECC71', bg: '#0A2A1A', title: 'Activity logs', desc: 'Every action logged automatically. See who changed what and when.' },
            { icon: 'ti-message', color: '#F39C12', bg: '#2A1F0A', title: 'Task comments', desc: 'Leave comments directly on tasks. No more hunting for updates in group chats.' },
            { icon: 'ti-chart-bar', color: '#6C63FF', bg: '#1E1A3F', title: 'Analytics', desc: 'Charts for task completion, member progress, and project health.' },
            { icon: 'ti-bell', color: '#E74C3C', bg: '#2A0A0A', title: 'Notifications', desc: 'Get notified when assigned, commented on, or when deadlines are near.' },
          ].map((f, i) => (
            <div key={i} className="card hover:border-primary transition-colors">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4" style={{ background: f.bg }}>
                <i className={`ti ${f.icon} text-base`} style={{ color: f.color }} aria-hidden="true"></i>
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
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Thesis / Capstone', icon: 'ti-school', color: '#6C63FF', bg: '#1E1A3F', desc: 'Track chapters, defenses, and research tasks' },
            { label: 'School Subject', icon: 'ti-book', color: '#4ECDC4', bg: '#0A2A2A', desc: 'Group activities and requirements' },
            { label: 'Freelance / Client', icon: 'ti-briefcase', color: '#EF9F27', bg: '#2A1F0A', desc: 'Client deliverables and milestones' },
            { label: 'Personal / Side', icon: 'ti-heart', color: '#2ECC71', bg: '#0A2A1A', desc: 'Personal goals and side projects' },
          ].map((t, i) => (
            <div key={i} className="card text-center hover:border-primary transition-colors">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-3" style={{ background: t.bg }}>
                <i className={`ti ${t.icon} text-base`} style={{ color: t.color }} aria-hidden="true"></i>
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