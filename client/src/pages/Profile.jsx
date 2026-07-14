import { useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/index'

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
        <h2 className="text-xl font-medium text-textprimary">Profile</h2>
        <p className="text-textsecondary text-sm mt-1">Manage your account settings</p>
      </div>

      {/* Avatar section */}
      <div className="card-lg mb-4">
        <h3 className="text-textprimary text-sm font-medium mb-4">Profile picture</h3>
        <div className="flex items-center gap-5">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center overflow-hidden"
              style={{ background: 'rgba(108, 99, 255, 0.2)' }}
            >
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.full_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-primary text-xl font-medium">{initials}</span>
              )}
            </div>
            {uploadingAvatar && (
              <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
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
        <h3 className="text-textprimary text-sm font-medium mb-4">Account info</h3>
        <div className="mb-4">
          <label className="block text-textsecondary text-xs mb-1.5">Email address</label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-textsecondary opacity-60 cursor-not-allowed"
          />
          <p className="text-textsecondary text-xs mt-1">Email cannot be changed.</p>
        </div>
        <div className="mb-1">
          <label className="block text-textsecondary text-xs mb-1.5">Member since</label>
          <input
            type="text"
            value={user?.created_at ? new Date(user.created_at).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
            disabled
            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-textsecondary opacity-60 cursor-not-allowed"
          />
        </div>
      </div>

      {/* Update name */}
      <div className="card-lg mb-4">
        <h3 className="text-textprimary text-sm font-medium mb-4">Update name</h3>

        {nameMsg && (
          <div className="flex items-center gap-2 border border-success border-opacity-30 rounded-lg px-4 py-3 mb-4" style={{ background: '#0A2A1A' }}>
            <i className="ti ti-circle-check text-success text-sm" aria-hidden="true"></i>
            <span className="text-success text-sm">{nameMsg}</span>
          </div>
        )}
        {nameError && (
          <div className="flex items-center gap-2 border border-danger border-opacity-30 rounded-lg px-4 py-3 mb-4" style={{ background: '#2A0A0A' }}>
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
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-textprimary focus:outline-none focus:border-primary transition-colors"
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
      <div className="card-lg">
        <h3 className="text-textprimary text-sm font-medium mb-4">Change password</h3>

        {passMsg && (
          <div className="flex items-center gap-2 border border-success border-opacity-30 rounded-lg px-4 py-3 mb-4" style={{ background: '#0A2A1A' }}>
            <i className="ti ti-circle-check text-success text-sm" aria-hidden="true"></i>
            <span className="text-success text-sm">{passMsg}</span>
          </div>
        )}
        {passError && (
          <div className="flex items-center gap-2 border border-danger border-opacity-30 rounded-lg px-4 py-3 mb-4" style={{ background: '#2A0A0A' }}>
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
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-textprimary placeholder-textsecondary focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-textsecondary text-xs mb-1.5">New password</label>
            <input
              type="password"
              value={passForm.new_password}
              onChange={e => setPassForm({ ...passForm, new_password: e.target.value })}
              placeholder="At least 6 characters"
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-textprimary placeholder-textsecondary focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="block text-textsecondary text-xs mb-1.5">Confirm new password</label>
            <input
              type="password"
              value={passForm.confirm_password}
              onChange={e => setPassForm({ ...passForm, confirm_password: e.target.value })}
              placeholder="Repeat new password"
              className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-textprimary placeholder-textsecondary focus:outline-none focus:border-primary transition-colors"
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
    </div>
  )
}