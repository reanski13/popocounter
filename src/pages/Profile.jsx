import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

function Section({ title, children }) {
  return (
    <div className="card p-5 space-y-4">
      <h2 className="font-display text-base" style={{ color: 'var(--text-primary)' }}>{title}</h2>
      {children}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  )
}

function Alert({ type, msg }) {
  if (!msg) return null
  const colors = type === 'error'
    ? { bg: '#fee2e2', text: '#dc2626', border: '#fca5a5' }
    : { bg: '#dcfce7', text: '#16a34a', border: '#86efac' }
  return (
    <div
      className="p-3 rounded-xl text-xs font-semibold border"
      style={{ backgroundColor: colors.bg, color: colors.text, borderColor: colors.border }}
    >
      {msg}
    </div>
  )
}

export default function Profile() {
  const { user, profile, updateProfile, updatePassword, uploadAvatar } = useAuth()

  // Display name
  const [displayName, setDisplayName]   = useState(profile?.display_name || '')
  const [nameLoading, setNameLoading]   = useState(false)
  const [nameMsg, setNameMsg]           = useState({ type: '', text: '' })

  // Password
  const [newPassword, setNewPassword]   = useState('')
  const [confirmPw, setConfirmPw]       = useState('')
  const [pwLoading, setPwLoading]       = useState(false)
  const [pwMsg, setPwMsg]               = useState({ type: '', text: '' })

  // Avatar
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [avatarMsg, setAvatarMsg]         = useState({ type: '', text: '' })
  const fileRef = useRef(null)

  const handleSaveName = async () => {
    if (!displayName.trim()) return
    setNameLoading(true)
    setNameMsg({ type: '', text: '' })
    const { error } = await updateProfile({ display_name: displayName.trim() })
    setNameLoading(false)
    setNameMsg(error
      ? { type: 'error', text: error.message }
      : { type: 'success', text: 'Display name updated!' }
    )
  }

  const handleSavePassword = async () => {
    if (newPassword !== confirmPw) {
      setPwMsg({ type: 'error', text: "Passwords don't match." })
      return
    }
    if (newPassword.length < 6) {
      setPwMsg({ type: 'error', text: 'Minimum 6 characters.' })
      return
    }
    setPwLoading(true)
    setPwMsg({ type: '', text: '' })
    const { error } = await updatePassword(newPassword)
    setPwLoading(false)
    if (error) {
      setPwMsg({ type: 'error', text: error.message })
    } else {
      setPwMsg({ type: 'success', text: 'Password updated!' })
      setNewPassword('')
      setConfirmPw('')
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setAvatarMsg({ type: 'error', text: 'File must be under 2MB.' })
      return
    }
    setAvatarLoading(true)
    setAvatarMsg({ type: '', text: '' })
    const { error } = await uploadAvatar(file)
    setAvatarLoading(false)
    setAvatarMsg(error
      ? { type: 'error', text: error.message }
      : { type: 'success', text: 'Avatar updated!' }
    )
  }

  return (
    <div className="min-h-screen pb-20" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 border-b px-4 py-3"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Link
            to="/dashboard"
            className="w-9 h-9 rounded-xl border flex items-center justify-center text-sm"
            style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' }}
          >
            ←
          </Link>
          <h1 className="font-display text-lg" style={{ color: 'var(--text-primary)' }}>
            Profile Settings
          </h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-5 space-y-4">

        {/* ── Avatar ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-5 flex items-center gap-4"
        >
          {/* Avatar preview */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl overflow-hidden flex-shrink-0 border"
            style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' }}
          >
            {avatarLoading
              ? <span className="animate-float text-2xl">💩</span>
              : profile?.avatar_url
                ? <img src={profile.avatar_url} className="w-full h-full object-cover" alt="avatar" />
                : '👤'
            }
          </div>

          <div className="flex-1">
            <p className="font-bold text-sm mb-0.5" style={{ color: 'var(--text-primary)' }}>
              {profile?.display_name || user?.email?.split('@')[0]}
            </p>
            <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{user?.email}</p>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
              style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--brand)' }}
            >
              Change photo
            </button>
            <Alert type={avatarMsg.type} msg={avatarMsg.text} />
          </div>
        </motion.div>

        {/* ── Display Name ───────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <Section title="Display Name">
            <Field label="Name shown on dashboard">
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="e.g. PoopMaster3000"
                className="input-field"
              />
            </Field>
            <Alert type={nameMsg.type} msg={nameMsg.text} />
            <motion.button
              onClick={handleSaveName}
              disabled={nameLoading}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 rounded-2xl text-sm font-bold text-white disabled:opacity-60"
              style={{ backgroundColor: 'var(--brand)' }}
            >
              {nameLoading ? 'Saving…' : 'Save name'}
            </motion.button>
          </Section>
        </motion.div>

        {/* ── Email (read-only) ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Section title="Account Email">
            <Field label="Email address">
              <input
                type="email"
                value={user?.email || ''}
                readOnly
                className="input-field opacity-60 cursor-not-allowed"
              />
            </Field>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Email changes require re-authentication. Contact support if needed.
            </p>
          </Section>
        </motion.div>

        {/* ── Change Password ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Section title="Change Password">
            <Field label="New password">
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="input-field"
              />
            </Field>
            <Field label="Confirm password">
              <input
                type="password"
                value={confirmPw}
                onChange={e => setConfirmPw(e.target.value)}
                placeholder="Repeat new password"
                className="input-field"
              />
            </Field>
            <Alert type={pwMsg.type} msg={pwMsg.text} />
            <motion.button
              onClick={handleSavePassword}
              disabled={pwLoading || !newPassword}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3 rounded-2xl text-sm font-bold text-white disabled:opacity-60"
              style={{ backgroundColor: 'var(--brand)' }}
            >
              {pwLoading ? 'Updating…' : 'Update password'}
            </motion.button>
          </Section>
        </motion.div>

        {/* ── Stats summary ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-5"
        >
          <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
            Member since {user?.created_at
              ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
              : '—'
            }
          </p>
        </motion.div>
      </main>
    </div>
  )
}