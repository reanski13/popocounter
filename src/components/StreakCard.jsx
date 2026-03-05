import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STREAK_LABELS = [
  { min: 0,  max: 0,  emoji: '🪹', label: 'No streak yet',    msg: 'Start logging today!' },
  { min: 1,  max: 2,  emoji: '🌱', label: 'Getting started',  msg: 'Keep it going!' },
  { min: 3,  max: 6,  emoji: '🔥', label: 'On fire',          msg: "You're warming up!" },
  { min: 7,  max: 13, emoji: '💪', label: 'Week warrior',     msg: 'One whole week!' },
  { min: 14, max: 29, emoji: '⚡', label: 'Unstoppable',      msg: '2 weeks strong!' },
  { min: 30, max: Infinity, emoji: '👑', label: 'Poop Legend', msg: 'A whole month!' },
]

function getStreakInfo(streak) {
  return STREAK_LABELS.find(s => streak >= s.min && streak <= s.max) || STREAK_LABELS[0]
}

export default function StreakCard({ currentStreak, longestStreak, displayName }) {
  const [showShare, setShowShare] = useState(false)
  const [copied, setCopied] = useState(false)
  const info = getStreakInfo(currentStreak)

  const shareText = `${info.emoji} I'm on a ${currentStreak}-day poop streak on PopoCounter! ${info.msg} Track yours at popocounter.app`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({ text: shareText })
    } else {
      setShowShare(true)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="card p-5 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, var(--bg-card) 0%, var(--bg-subtle) 100%)' }}
    >
      {/* Background glow for active streaks */}
      {currentStreak >= 3 && (
        <div
          className="absolute inset-0 opacity-20 rounded-3xl"
          style={{
            background: `radial-gradient(circle at 80% 50%, var(--brand) 0%, transparent 70%)`,
          }}
        />
      )}

      <div className="relative flex items-center justify-between gap-4">
        {/* Left: streak info */}
        <div className="flex items-center gap-4">
          <motion.div
            key={currentStreak}
            animate={currentStreak > 0 ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.5 }}
            className={`text-4xl ${currentStreak >= 3 ? 'animate-float' : ''}`}
          >
            {info.emoji}
          </motion.div>

          <div>
            <div className="flex items-baseline gap-2">
              <span
                className="font-display text-5xl leading-none"
                style={{ color: 'var(--brand)' }}
              >
                {currentStreak}
              </span>
              <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                day{currentStreak !== 1 ? 's' : ''}
              </span>
            </div>
            <p className="text-xs font-bold uppercase tracking-widest mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {info.label}
            </p>
          </div>
        </div>

        {/* Right: share + best */}
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={handleNativeShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
            style={{
              backgroundColor: 'var(--brand)',
              color: 'white',
            }}
          >
            <span>Share</span>
            <span>📤</span>
          </button>
          <div className="text-right">
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Best</p>
            <p className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>
              {longestStreak}d
            </p>
          </div>
        </div>
      </div>

      {/* Streak progress dots (last 7 days visual) */}
      {currentStreak > 0 && (
        <div className="flex gap-1.5 mt-4">
          {Array.from({ length: 7 }).map((_, i) => {
            const filled = i < Math.min(currentStreak, 7)
            return (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="h-1.5 flex-1 rounded-full"
                style={{
                  backgroundColor: filled ? 'var(--brand)' : 'var(--border)',
                  opacity: filled ? 1 : 0.4,
                }}
              />
            )
          })}
          {currentStreak > 7 && (
            <span className="text-[10px] font-bold" style={{ color: 'var(--brand)' }}>
              +{currentStreak - 7}
            </span>
          )}
        </div>
      )}

      {/* Share modal */}
      <AnimatePresence>
        {showShare && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 rounded-3xl flex flex-col items-center justify-center p-5 text-center"
            style={{ backgroundColor: 'var(--bg-card)', zIndex: 10 }}
          >
            <p className="font-display text-lg mb-3" style={{ color: 'var(--text-primary)' }}>
              Share your streak 🎉
            </p>
            <div
              className="w-full rounded-xl p-3 text-sm mb-4 text-left"
              style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}
            >
              {shareText}
            </div>
            <div className="flex gap-2 w-full">
              <button
                onClick={handleCopy}
                className="flex-1 py-2 rounded-xl text-sm font-bold text-white transition-colors"
                style={{ backgroundColor: copied ? '#22c55e' : 'var(--brand)' }}
              >
                {copied ? '✓ Copied!' : 'Copy text'}
              </button>
              <button
                onClick={() => setShowShare(false)}
                className="px-4 py-2 rounded-xl text-sm font-bold"
                style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-secondary)' }}
              >
                Close
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}