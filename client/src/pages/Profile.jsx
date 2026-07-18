import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/index'
import { COLOR_THEMES, getColorTheme, setColorTheme } from '../theme'
import { useTheme } from '../context/ThemeContext'

export default function Profile() {
  const { user, login } = useAuth()
  const fileRef = useRef()

  const [nameForm, setNameForm] = useState({ full_name: user?.full_name || '' })
  const [passForm, setPassForm] = useState({
    current_password: '', new_password: '', confirm_password: ''
  })
  const [nameMsg, setNameMsg] = useState('')
  const [passMsg, setPassMsg] = useState('')
  const [nameError, setNameError] = useState('')
  const [passError, setPassError] = useState('')
  const [savingName, setSavingName] = useState(false)
  const [savingPass, setSavingPass] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [memberSince, setMemberSince] = useState(user?.created_at || '')

  // Theme: light/dark mode (shared global state) + accent color theme
  const { dark, toggleTheme } = useTheme()
  const [colorTheme, setColorThemeState] = useState(getColorTheme)

  const chooseColorTheme = (id) => {
    setColorThemeState(setColorTheme(id))
  }

  // The stored user lacks created_at; fetch the full profile to populate it
  useEffect(() => {
    let active = true
    api.get('/auth/profile')
      .then((res) => {
        if (active && res.data?.created_at) setMemberSince(res.data.created_at)
      })
      .catch(() => {})
    return () => { active = false }
  }, [])

  const initials = user?.full_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const handleUpdateName = async (e) => {
    e.preventDefault()
    if (!nameForm.full_name.trim()) return setNameError('Name is required.')
    setSavingName(true)
    setNameError('')
    setNameMsg('')
    try {
      const res = await api.put('/auth/profile', { full_name: nameForm.full_name })
      login({ ...user, full_name: res.data.user.full_name }, localStorage.getItem('token'))
      setNameMsg('Name updated successfully!')
    } catch (err) {
      setNameError(err.response?.data?.error || 'Something went wrong.')
    } finally {
      setSavingName(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPassError('')
    setPassMsg('')
    if (passForm.new_password !== passForm.confirm_password) {
      return setPassError('New passwords do not match.')
    }
    if (passForm.new_password.length < 6) {
      return setPassError('New password must be at least 6 characters.')
    }
    setSavingPass(true)
    try {
      await api.patch('/auth/change-password', {
        current_password: passForm.current_password,
        new_password: passForm.new_password
      })
      setPassMsg('Password changed successfully!')
      setPassForm({ current_password: '', new_password: '', confirm_password: '' })
    } catch (err) {
      setPassError(err.response?.data?.error || 'Something went wrong.')
    } finally {
      setSavingPass(false)
    }
  }

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploadingAvatar(true)
    try {
      const form = new FormData()
      form.append('avatar', file)
      const res = await api.post('/auth/avatar', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      login({ ...user, avatar_url: res.data.avatar_url }, localStorage.getItem('token'))
    } catch (err) {
      console.error(err)
    } finally {
      setUploadingAvatar(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="font-pixel text-base uppercase tracking-wide text-textprimary">Profile</h2>
        <p className="text-textsecondary text-sm mt-1">Manage your account settings</p>
      </div>

      {/* Avatar section */}
      <div className="card-lg mb-4">
        <h3 className="font-pixel text-xs uppercase tracking-wide text-textprimary mb-4">Profile picture</h3>
        <div className="flex items-center gap-5">
          <div className="relative">
            <div
              className="w-16 h-16 border-[3px] border-border bg-primary flex items-center justify-center overflow-hidden shadow-retro"
            >
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-black text-xl font-pixel">{initials}</span>
              )}
            </div>
            {uploadingAvatar && (
              <div className="absolute inset-0 border-[3px] border-border bg-black/50 flex items-center justify-center">
                <i className="ti ti-loader-2 animate-spin text-white" aria-hidden="true"></i>
              </div>
            )}
          </div>
          <div>
            <button
              onClick={() => fileRef.current.click()}
              disabled={uploadingAvatar}
              className="btn btn-outline disabled:opacity-50"
            >
              <i className="ti ti-upload text-sm" aria-hidden="true"></i>
              {uploadingAvatar ? 'Uploading...' : 'Upload photo'}
            </button>
            <p className="text-textsecondary text-xs mt-2">JPG, PNG or WEBP · Max 2MB</p>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Account info */}
      <div className="card-lg mb-4">
        <h3 className="font-pixel text-xs uppercase tracking-wide text-textprimary mb-4">Account info</h3>
        <div className="mb-4">
          <label className="block text-textsecondary text-xs mb-1.5">Email address</label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="input opacity-60 cursor-not-allowed"
          />
          <p className="text-textsecondary text-xs mt-1">Email cannot be changed.</p>
        </div>
        <div className="mb-1">
          <label className="block text-textsecondary text-xs mb-1.5">Member since</label>
          <input
            type="text"
            value={memberSince ? new Date(memberSince).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
            disabled
            className="input opacity-60 cursor-not-allowed"
          />
        </div>
      </div>

      {/* Update name */}
      <div className="card-lg mb-4">
        <h3 className="font-pixel text-xs uppercase tracking-wide text-textprimary mb-4">Update name</h3>

        {nameMsg && (
          <div className="flex items-center gap-2 border-[3px] border-success bg-success/10 px-4 py-3 mb-4">
            <i className="ti ti-circle-check text-success text-sm" aria-hidden="true"></i>
            <span className="text-success text-sm">{nameMsg}</span>
          </div>
        )}
        {nameError && (
          <div className="flex items-center gap-2 border-[3px] border-danger bg-danger/10 px-4 py-3 mb-4">
            <i className="ti ti-alert-circle text-danger text-sm" aria-hidden="true"></i>
            <span className="text-danger text-sm">{nameError}</span>
          </div>
        )}

        <form onSubmit={handleUpdateName} className="space-y-4">
          <div>
            <label className="block text-textsecondary text-xs mb-1.5">Full name</label>
            <input
              type="text"
              value={nameForm.full_name}
              onChange={e => setNameForm({ full_name: e.target.value })}
              className="input"
            />
          </div>
          <button
            type="submit"
            disabled={savingName}
            className="btn btn-primary disabled:opacity-50"
          >
            {savingName ? (
              <><i className="ti ti-loader-2 animate-spin" aria-hidden="true"></i>Saving...</>
            ) : (
              <><i className="ti ti-check" aria-hidden="true"></i>Save name</>
            )}
          </button>
        </form>
      </div>

      {/* Change password */}
      <div className="card-lg mb-4">
        <h3 className="font-pixel text-xs uppercase tracking-wide text-textprimary mb-4">Change password</h3>

        {passMsg && (
          <div className="flex items-center gap-2 border-[3px] border-success bg-success/10 px-4 py-3 mb-4">
            <i className="ti ti-circle-check text-success text-sm" aria-hidden="true"></i>
            <span className="text-success text-sm">{passMsg}</span>
          </div>
        )}
        {passError && (
          <div className="flex items-center gap-2 border-[3px] border-danger bg-danger/10 px-4 py-3 mb-4">
            <i className="ti ti-alert-circle text-danger text-sm" aria-hidden="true"></i>
            <span className="text-danger text-sm">{passError}</span>
          </div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-textsecondary text-xs mb-1.5">Current password</label>
            <input
              type="password"
              value={passForm.current_password}
              onChange={e => setPassForm({ ...passForm, current_password: e.target.value })}
              placeholder="Enter current password"
              className="input"
            />
          </div>
          <div>
            <label className="block text-textsecondary text-xs mb-1.5">New password</label>
            <input
              type="password"
              value={passForm.new_password}
              onChange={e => setPassForm({ ...passForm, new_password: e.target.value })}
              placeholder="At least 6 characters"
              className="input"
            />
          </div>
          <div>
            <label className="block text-textsecondary text-xs mb-1.5">Confirm new password</label>
            <input
              type="password"
              value={passForm.confirm_password}
              onChange={e => setPassForm({ ...passForm, confirm_password: e.target.value })}
              placeholder="Repeat new password"
              className="input"
            />
          </div>
          <button
            type="submit"
            disabled={savingPass}
            className="btn btn-primary disabled:opacity-50"
          >
            {savingPass ? (
              <><i className="ti ti-loader-2 animate-spin" aria-hidden="true"></i>Updating...</>
            ) : (
              <><i className="ti ti-lock" aria-hidden="true"></i>Update password</>
            )}
          </button>
        </form>
      </div>

      {/* Appearance */}
      <div className="card-lg">
        <h3 className="font-pixel text-xs uppercase tracking-wide text-textprimary mb-4">Appearance</h3>

        {/* Light / dark mode */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <i className={`ti ${dark ? 'ti-moon' : 'ti-sun'} text-base text-textsecondary`} aria-hidden="true"></i>
            <div>
              <p className="text-textprimary text-sm">{dark ? 'Dark mode' : 'Light mode'}</p>
              <p className="text-textsecondary text-xs">Switch between light and dark themes</p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={dark}
            aria-label="Toggle dark mode"
            onClick={toggleTheme}
            className={`relative inline-flex h-7 w-12 flex-shrink-0 items-center border-[3px] border-border shadow-retro transition-colors ${dark ? 'bg-primary' : 'bg-border'}`}
          >
            <span
              className={`inline-block h-4 w-4 transform bg-white border-[3px] border-border transition-transform ${dark ? 'translate-x-6' : 'translate-x-0.5'}`}
            />
          </button>
        </div>

        <div className="h-px bg-border my-3" />

        {/* Accent color theme */}
        <div className="py-2">
          <p className="text-textprimary text-sm mb-1">Accent color</p>
          <p className="text-textsecondary text-xs mb-3">Choose the highlight color used across the app</p>
          <div className="flex items-center gap-3">
            {COLOR_THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => chooseColorTheme(t.id)}
                aria-label={t.label}
                aria-pressed={colorTheme === t.id}
                title={t.label}
                className={`relative w-9 h-9 border-[3px] border-border shadow-retro transition-transform hover:bg-black/10 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none ${colorTheme === t.id ? 'ring-2 ring-offset-2 ring-primary ring-offset-surface' : ''}`}
                style={{ backgroundColor: t.value }}
              >
                {colorTheme === t.id && (
                  <i className="ti ti-check text-white text-sm absolute inset-0 flex items-center justify-center drop-shadow-[0_1px_0_rgba(0,0,0,0.6)]" aria-hidden="true"></i>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}