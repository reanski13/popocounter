import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const { signUp } = useAuth()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError("Passwords don't match."); return }
    if (password.length < 6)  { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    const { error } = await signUp(email, password)
    setLoading(false)
    if (error) setError(error.message)
    else setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--bg)' }}>
        <motion.div className="text-center max-w-sm" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="text-5xl mb-4">✉️</div>
          <h2 className="font-display text-2xl mb-2" style={{ color: 'var(--text-primary)' }}>Check your email</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            We sent a confirmation to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>.
          </p>
          <Link to="/login" className="font-bold text-sm" style={{ color: 'var(--brand)' }}>Back to login →</Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-30 pointer-events-none" style={{ backgroundColor: 'var(--brand)', transform: 'translate(40%,-40%)' }} />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none" style={{ backgroundColor: 'var(--brand)', transform: 'translate(-40%,40%)' }} />

      <motion.div className="relative w-full max-w-sm" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">💩</div>
          <h1 className="font-display text-3xl" style={{ color: 'var(--text-primary)' }}>PopoCounter</h1>
          <p className="text-sm mt-1 italic" style={{ color: 'var(--text-muted)' }}>Your wellness, tracked</p>
        </div>

        <div className="rounded-4xl shadow-poop-lg p-8 border" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
          <h2 className="font-display text-xl mb-6" style={{ color: 'var(--text-primary)' }}>Create account</h2>

          {error && (
            <div className="mb-4 p-3 rounded-xl text-xs font-semibold border" style={{ backgroundColor: '#fee2e2', color: '#dc2626', borderColor: '#fca5a5' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" className="input-field" />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Min. 6 characters" className="input-field" />
            </div>
            <div>
              <label className="label">Confirm Password</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required placeholder="Repeat password" className="input-field" />
            </div>
            <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.97 }}
              className="w-full py-3.5 rounded-2xl font-bold text-white shadow-poop disabled:opacity-60"
              style={{ backgroundColor: 'var(--brand)' }}>
              {loading ? 'Creating account…' : 'Create account 💩'}
            </motion.button>
          </form>
        </div>

        <p className="text-center mt-5 text-sm" style={{ color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" className="font-bold" style={{ color: 'var(--brand)' }}>Sign in</Link>
        </p>
      </motion.div>
    </div>
  )
}