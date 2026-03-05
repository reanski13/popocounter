import { motion } from 'framer-motion'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'

export default function BristolChart({ data }) {
  const hasData = data.some(d => d.count > 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="card p-5"
    >
      <h3 className="font-display text-base mb-0.5" style={{ color: 'var(--text-primary)' }}>
        Stool Type Distribution
      </h3>
      <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>Bristol Chart scale 1–7</p>

      {!hasData ? (
        <div className="h-40 flex flex-col items-center justify-center gap-2">
          <span className="text-3xl">🎯</span>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Log some entries to see your distribution</p>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={180}>
            <RadarChart data={data.map(d => ({ ...d, subject: `T${d.type}` }))}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'Montserrat', fontWeight: 600 }}
              />
              <Radar
                dataKey="count"
                stroke="var(--brand)"
                fill="var(--brand)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Tooltip
                formatter={(v) => [`${v} entries`, 'Count']}
                contentStyle={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                }}
              />
            </RadarChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-7 gap-1 mt-1">
            {data.map(({ type, count }) => (
              <div key={type} className="text-center">
                <div className="text-[10px] font-bold" style={{ color: 'var(--text-muted)' }}>{type}</div>
                <div className="text-[11px] font-display font-bold" style={{ color: 'var(--brand)' }}>{count}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  )
}