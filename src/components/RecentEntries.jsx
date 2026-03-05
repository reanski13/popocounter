import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, parseISO } from 'date-fns'
import { BRISTOL_TYPES } from './BristolSelector'

export default function RecentEntries({ entries, onDelete }) {
  const [expandedDrawing, setExpandedDrawing] = useState(null)

  if (!entries.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-8 text-center"
      >
        <div className="text-4xl mb-3">🪹</div>
        <p className="font-display text-base mb-1" style={{ color: 'var(--text-primary)' }}>
          Nothing logged yet
        </p>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Tap the button below to log your first visit!
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="card p-5"
    >
      <h3 className="font-display text-base mb-4" style={{ color: 'var(--text-primary)' }}>
        Recent Entries
      </h3>
      <div className="space-y-2">
        <AnimatePresence>
          {entries.map((entry, i) => {
            const bristol = BRISTOL_TYPES[entry.bristol_type - 1]
            const date = parseISO(entry.created_at)
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12, height: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center gap-3 py-2.5 px-3 rounded-2xl group"
                style={{ backgroundColor: 'var(--bg-subtle)' }}
              >
                <span className="text-xl flex-shrink-0">{bristol?.emoji}</span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                      Type {entry.bristol_type}
                    </span>
                    <span style={{ color: 'var(--border)' }}>·</span>
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {format(date, 'MMM d, h:mm a')}
                    </span>
                    {entry.drawing_data && (
                      <button
                        onClick={() => setExpandedDrawing(
                          expandedDrawing === entry.id ? null : entry.id
                        )}
                        className="text-xs font-semibold"
                        style={{ color: 'var(--brand)' }}
                      >
                        🎨 Drawing
                      </button>
                    )}
                  </div>
                  {entry.note && (
                    <p className="text-xs truncate mt-0.5 italic" style={{ color: 'var(--text-muted)' }}>
                      "{entry.note}"
                    </p>
                  )}
                  <AnimatePresence>
                    {expandedDrawing === entry.id && entry.drawing_data && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <img
                          src={entry.drawing_data}
                          alt="Poop drawing"
                          className="mt-2 rounded-xl w-full max-w-[200px] border"
                          style={{ borderColor: 'var(--border)' }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  onClick={() => onDelete(entry.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-xs px-1 flex-shrink-0"
                  style={{ color: 'var(--text-muted)' }}
                  title="Delete entry"
                >
                  ✕
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}