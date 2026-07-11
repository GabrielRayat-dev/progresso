import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/index'

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (form.password !== form.confirm_password) {
      return setError('Passwords do not match.')
    }

    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters.')
    }

    setLoading(true)
    try {
      const res = await api.post('/auth/register', {
        full_name: form.full_name,
        email: form.email,
        password: form.password
      })
      login(res.data.user, res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <i className="ti ti-chart-bar text-white text-sm" aria-hidden="true"></i>
          </div>
          <span className="font-medium text-lg text-textprimary">Progresso</span>
        </div>

        {/* Card */}
        <div className="bg-surface border border-border rounded-2xl p-8">
          <h1 className="text-xl font-medium text-textprimary mb-1">Create your account</h1>
          <p className="text-textsecondary text-sm mb-6">
            Free forever · No credit card required
          </p>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-danger bg-opacity-10 border border-danger border-opacity-30 rounded-lg px-4 py-3 mb-4">
              <i className="ti ti-alert-circle text-danger text-sm" aria-hidden="true"></i>
              <span className="text-danger text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-textsecondary text-xs mb-1.5">
                Full name
              </label>
              <input
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                placeholder="Juan Dela Cruz"
                required
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-textprimary placeholder-textsecondary focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-textsecondary text-xs mb-1.5">
                Email address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@email.com"
                required
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-textprimary placeholder-textsecondary focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-textsecondary text-xs mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                required
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-textprimary placeholder-textsecondary focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-textsecondary text-xs mb-1.5">
                Confirm password
              </label>
              <input
                type="password"
                name="confirm_password"
                value={form.confirm_password}
                onChange={handleChange}
                placeholder="Repeat your password"
                required
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-textprimary placeholder-textsecondary focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <i className="ti ti-loader-2 animate-spin" aria-hidden="true"></i>
                  Creating account...
                </>
              ) : (
                <>
                  <i className="ti ti-user-plus" aria-hidden="true"></i>
                  Create account
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-textsecondary text-xs">by signing up you agree to our terms</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          {/* Features reminder */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: 'ti-infinity', text: 'Free forever' },
              { icon: 'ti-users', text: 'Invite teammates' },
              { icon: 'ti-chart-bar', text: 'Analytics included' },
              { icon: 'ti-lock', text: 'Secure and private' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-textsecondary text-xs">
                <i className={`ti ${item.icon} text-primary text-xs`} aria-hidden="true"></i>
                {item.text}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-textsecondary text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
        <p className="text-center mt-3">
          <Link
            to="/"
            className="text-textsecondary text-xs hover:text-textprimary transition-colors flex items-center justify-center gap-1"
          >
            <i className="ti ti-arrow-left text-xs" aria-hidden="true"></i>
            Back to home
          </Link>
        </p>

      </div>
    </div>
  )
}