import { motion } from 'framer-motion'

const BRISTOL_TYPES = [
  { type: 1, emoji: '🪨', label: 'Type 1', desc: 'Separate hard lumps' },
  { type: 2, emoji: '🍫', label: 'Type 2', desc: 'Lumpy & sausage-like' },
  { type: 3, emoji: '🌭', label: 'Type 3', desc: 'Sausage with cracks' },
  { type: 4, emoji: '🍌', label: 'Type 4', desc: 'Smooth & soft ✅' },
  { type: 5, emoji: '☁️', label: 'Type 5', desc: 'Soft blobs' },
  { type: 6, emoji: '💧', label: 'Type 6', desc: 'Fluffy, mushy' },
  { type: 7, emoji: '🌊', label: 'Type 7', desc: 'Watery, no solids' },
]

export default function BristolSelector({ value, onChange }) {
  return (
    <div className="space-y-3">
      <label className="label">Bristol Stool Type</label>
      <div className="grid grid-cols-7 gap-1.5">
        {BRISTOL_TYPES.map(({ type, emoji, label, desc }) => {
          const selected = value === type
          return (
            <motion.button
              key={type}
              type="button"
              title={`${label}: ${desc}`}
              onClick={() => onChange(type)}
              whileTap={{ scale: 0.9 }}
              className="relative flex flex-col items-center justify-center rounded-xl border-2 p-2 transition-colors duration-150 cursor-pointer select-none"
              style={{
                borderColor: selected ? 'var(--brand)' : 'var(--border)',
                backgroundColor: selected ? 'var(--brand-light)' : 'var(--bg-subtle)',
                transform: selected ? 'scale(1.08)' : 'scale(1)',
              }}
            >
              <span className="text-lg leading-none">{emoji}</span>
              <span
                className="text-[9px] font-bold mt-1"
                style={{ color: selected ? 'var(--brand-dark)' : 'var(--text-muted)' }}
              >
                {type}
              </span>
            </motion.button>
          )
        })}
      </div>
      {value && (
        <p className="text-xs italic text-center" style={{ color: 'var(--text-muted)' }}>
          {BRISTOL_TYPES[value - 1].label}: {BRISTOL_TYPES[value - 1].desc}
        </p>
      )}
    </div>
  )
}

export { BRISTOL_TYPES }