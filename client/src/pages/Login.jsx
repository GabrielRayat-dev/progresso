import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/index'
import ThemeToggle from '../components/layout/ThemeToggle'
import { navIcons } from '../constants/navIcons'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      login(res.data.user, res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Header with theme toggle */}
      <header className="sticky top-0 z-50 bg-background border-b-[3px] border-border">
        <div className="flex items-center justify-between px-4 md:px-8 py-3 max-w-7xl mx-auto">
          <Link to="/" className="flex items-center gap-2">
            <img src={navIcons.logo} alt="Progresso logo" className="h-8 w-8 object-contain flex-shrink-0" />
            <span className="font-pixel text-textprimary text-base uppercase tracking-wide">Progresso</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">

          {/* Card */}
          <div className="card-lg">
            <h1 className="font-pixel text-2xl uppercase text-textprimary mb-1">Welcome back</h1>
            <p className="text-textsecondary text-sm mb-6">Sign in to your account to continue</p>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 border-[3px] border-danger px-4 py-3 mb-4 bg-danger/10">
                <i className="ti ti-alert-circle text-danger text-sm" aria-hidden="true"></i>
                <span className="text-danger text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-textsecondary text-xs mb-1.5">Email address</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@email.com"
                  required
                  className="input"
                />
              </div>

              <div>
                <label className="block text-textsecondary text-xs mb-1.5">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="input"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-block disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <i className="ti ti-loader-2 animate-spin" aria-hidden="true"></i>
                    Signing in...
                  </>
                ) : (
                  <>
                    <i className="ti ti-login" aria-hidden="true"></i>
                    Sign in
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <p className="text-center text-textsecondary text-sm mt-6">
            No account yet?{' '}
            <Link to="/register" className="text-primary hover:underline">
              Create one free
            </Link>
          </p>
          <p className="text-center mt-3">
            <Link to="/" className="text-textsecondary text-xs hover:text-textprimary transition-colors flex items-center justify-center gap-1">
              <i className="ti ti-arrow-left text-xs" aria-hidden="true"></i>
              Back to home
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}
