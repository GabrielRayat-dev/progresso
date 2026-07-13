import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/index'

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
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <i className="ti ti-chart-bar text-white text-sm" aria-hidden="true"></i>
          </div>
          <span className="font-medium text-lg text-textprimary">Progresso</span>
        </div>

        {/* Card */}
        <div className="bg-surface border border-border rounded-2xl p-8 shadow-lg">
          <h1 className="text-xl font-medium text-textprimary mb-1">Welcome back</h1>
          <p className="text-textsecondary text-sm mb-6">Sign in to your account to continue</p>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 border border-danger border-opacity-30 rounded-lg px-4 py-3 mb-4" style={{ background: '#2A0A0A' }}>
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
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-textprimary placeholder-textsecondary focus:outline-none focus:border-primary transition-colors"
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
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-textprimary placeholder-textsecondary focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
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
  )
}