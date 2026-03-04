import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password !== confirm) {
      setError("Passwords don't match.")
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    const { error } = await signUp(email, password)
    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-stone-950 px-4">
        <div className="text-center max-w-sm">
          <div className="text-5xl mb-4">✉️</div>
          <h2 className="font-serif text-2xl text-stone-800 dark:text-stone-100 mb-2">Check your email</h2>
          <p className="text-stone-400 dark:text-stone-500 text-sm mb-6">
            We sent a confirmation link to <strong className="text-stone-600 dark:text-stone-300">{email}</strong>.
            Click it to activate your account.
          </p>
          <Link to="/login" className="text-rose-400 hover:text-rose-500 font-semibold text-sm">
            Back to login →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-stone-950 px-4">
      <div className="absolute top-0 right-0 w-72 h-72 bg-rose-100 dark:bg-rose-900/10 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-100 dark:bg-amber-900/10 rounded-full blur-3xl opacity-40 translate-y-1/3 -translate-x-1/4" />

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">💩</div>
          <h1 className="font-serif text-3xl font-bold text-stone-800 dark:text-stone-100">
            PopoCounter
          </h1>
          <p className="text-stone-400 dark:text-stone-500 text-sm mt-1 italic">
            Your wellness, tracked
          </p>
        </div>

        <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-xl shadow-stone-100 dark:shadow-stone-900 p-8 border border-stone-100 dark:border-stone-800">
          <h2 className="font-serif text-xl text-stone-700 dark:text-stone-200 mb-6">
            Create your account
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-xs text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-200 px-4 py-3 text-sm placeholder:text-stone-300 dark:placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Min. 6 characters"
                className="w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-200 px-4 py-3 text-sm placeholder:text-stone-300 dark:placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-200 px-4 py-3 text-sm placeholder:text-stone-300 dark:placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-700"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-rose-400 hover:bg-rose-500 dark:bg-rose-500 dark:hover:bg-rose-600 text-white font-semibold transition-all duration-200 shadow-md shadow-rose-100 dark:shadow-rose-900/30 disabled:opacity-60 active:scale-95"
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center mt-5 text-sm text-stone-400 dark:text-stone-500">
          Already have an account?{' '}
          <Link to="/login" className="text-rose-400 hover:text-rose-500 font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}