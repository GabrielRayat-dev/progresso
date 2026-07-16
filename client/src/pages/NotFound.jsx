import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-16 h-16 border-[3px] border-border shadow-retro flex items-center justify-center mx-auto mb-6 bg-primary/10">
          <i className="ti ti-error-404 text-primary text-3xl" aria-hidden="true"></i>
        </div>
        <h1 className="text-4xl font-medium text-textprimary mb-2">404</h1>
        <h2 className="text-xl font-medium text-textprimary mb-3">Page not found</h2>
        <p className="text-textsecondary text-sm mb-8 max-w-sm mx-auto">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="btn btn-primary"
          >
            <i className="ti ti-layout-dashboard" aria-hidden="true"></i>
            Go to dashboard
          </Link>
          <Link
            to="/"
            className="btn btn-outline"
          >
            <i className="ti ti-home" aria-hidden="true"></i>
            Home
          </Link>
        </div>
      </div>
    </div>
  )
}