import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BristolSelector from './BristolSelector'
import PoopDrawCanvas from './PoopDrawCanvas'

export default function AddEntryModal({ onAdd, onClose }) {
  const [bristolType, setBristolType] = useState(4)
  const [note, setNote] = useState('')
  const [drawingData, setDrawingData] = useState(null)
  const [showCanvas, setShowCanvas] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    const { error } = await onAdd({
      bristol_type: bristolType,
      note,
      drawing_data: drawingData,
    })
    setLoading(false)

    if (!error) {
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 1000)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />

        {/* Sheet */}
        <motion.div
          className="relative w-full sm:max-w-md rounded-t-4xl sm:rounded-4xl shadow-poop-lg p-6 pb-10 sm:pb-6 overflow-y-auto max-h-[90vh]"
          style={{ backgroundColor: 'var(--bg-card)' }}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 300 }}
        >
          {/* Handle */}
          <div
            className="w-10 h-1 rounded-full mx-auto mb-5 sm:hidden"
            style={{ backgroundColor: 'var(--border)' }}
          />

          {/* Success overlay */}
          <AnimatePresence>
            {success && (
              <motion.div
                className="absolute inset-0 rounded-4xl flex flex-col items-center justify-center z-10"
                style={{ backgroundColor: 'var(--bg-card)' }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="text-7xl"
                  animate={{ rotate: [0, -15, 15, -10, 10, 0], scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.6 }}
                >
                  💩
                </motion.div>
                <motion.p
                  className="font-display text-xl mt-4"
                  style={{ color: 'var(--text-primary)' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Logged! 🎉
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          <h2
            className="font-display text-2xl mb-1"
            style={{ color: 'var(--text-primary)' }}
          >
            Log a Visit 🚽
          </h2>
          <p className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>

          <div className="space-y-5">
            <BristolSelector value={bristolType} onChange={setBristolType} />

            {/* Notes */}
            <div>
              <label className="label">
                Notes <span className="normal-case font-normal">(optional)</span>
              </label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="How was it? Any observations…"
                rows={2}
                className="input-field resize-none"
              />
            </div>

            {/* Draw toggle */}
            <div>
              <button
                type="button"
                onClick={() => setShowCanvas(v => !v)}
                className="flex items-center gap-2 text-sm font-semibold transition-colors"
                style={{ color: showCanvas ? 'var(--brand)' : 'var(--text-muted)' }}
              >
                <span className="text-base">{showCanvas ? '🎨' : '✏️'}</span>
                {showCanvas ? 'Hide drawing' : 'Draw your popo (optional)'}
              </button>

              <AnimatePresence>
                {showCanvas && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden mt-3"
                  >
                    <PoopDrawCanvas onChange={setDrawingData} />
                    {drawingData && (
                      <p className="text-xs mt-2" style={{ color: 'var(--brand)' }}>
                        ✓ Drawing saved
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              onClick={handleSubmit}
              disabled={loading || success}
              whileTap={{ scale: 0.97 }}
              className="w-full py-4 rounded-2xl font-bold text-white text-base shadow-poop disabled:opacity-60"
              style={{ backgroundColor: 'var(--brand)' }}
            >
              {loading ? 'Saving…' : 'Log Entry 💩'}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}