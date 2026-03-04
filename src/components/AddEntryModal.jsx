import { useState } from 'react'
import BristolSelector from './BristolSelector'

export default function AddEntryModal({ onAdd, onClose }) {
  const [bristolType, setBristolType] = useState(4)
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    const { error } = await onAdd({ bristol_type: bristolType, note })
    setLoading(false)

    if (!error) {
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 800)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative w-full sm:max-w-md bg-white dark:bg-stone-900 rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 pb-10 sm:pb-6 animate-slide-up">

        {/* Handle */}
        <div className="w-10 h-1 bg-stone-200 dark:bg-stone-700 rounded-full mx-auto mb-5 sm:hidden" />

        <h2 className="font-serif text-2xl text-stone-800 dark:text-stone-100 mb-1">
          Log a Visit 🚽
        </h2>
        <p className="text-xs text-stone-400 dark:text-stone-500 mb-6">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>

        <div className="space-y-5">
          <BristolSelector value={bristolType} onChange={setBristolType} />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-2">
              Notes <span className="normal-case font-normal">(optional)</span>
            </label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="How was it? Any observations…"
              rows={2}
              className="w-full rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-200 px-4 py-3 text-sm placeholder:text-stone-300 dark:placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-rose-300 dark:focus:ring-rose-700 resize-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading || success}
            className={`
              w-full py-4 rounded-2xl font-semibold text-white text-base
              transition-all duration-200 shadow-lg
              ${success
                ? 'bg-green-500 scale-95'
                : 'bg-rose-400 hover:bg-rose-500 dark:bg-rose-500 dark:hover:bg-rose-600 active:scale-95'
              }
              disabled:opacity-70
            `}
          >
            {success ? '✓ Logged!' : loading ? 'Saving…' : 'Log Entry 💩'}
          </button>
        </div>
      </div>
    </div>
  )
}