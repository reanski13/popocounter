import { motion } from 'framer-motion'

export default function StatCard({ label, value, subtitle, accent = false, large = false, delay = 0, icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="rounded-3xl p-5 flex flex-col gap-1 shadow-sm"
      style={{
        backgroundColor: accent ? 'var(--brand)' : 'var(--bg-card)',
        border: `1px solid ${accent ? 'transparent' : 'var(--border)'}`,
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: accent ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)' }}
        >
          {label}
        </span>
        {icon && <span className="text-base">{icon}</span>}
      </div>

      <span
        className={`font-display font-black leading-none mt-1 ${large ? 'text-5xl' : 'text-3xl'}`}
        style={{ color: accent ? 'white' : 'var(--text-primary)' }}
      >
        {value}
      </span>

      {subtitle && (
        <span
          className="text-xs mt-1"
          style={{ color: accent ? 'rgba(255,255,255,0.65)' : 'var(--text-muted)' }}
        >
          {subtitle}
        </span>
      )}
    </motion.div>
  )
}