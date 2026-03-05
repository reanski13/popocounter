import { motion } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-2xl shadow-poop px-3 py-2 text-sm border"
        style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
      >
        <p className="font-bold text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</p>
        <p className="font-display text-lg" style={{ color: 'var(--brand)' }}>
          {payload[0].value} <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>total</span>
        </p>
      </div>
    )
  }
  return null
}

export default function MonthlyChart({ data }) {
  const isEmpty = data.every(d => d.count === 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="card p-5"
    >
      <h3 className="font-display text-base mb-1" style={{ color: 'var(--text-primary)' }}>
        Year Overview
      </h3>
      {isEmpty ? (
        <div className="h-40 flex flex-col items-center justify-center gap-2">
          <span className="text-3xl">📅</span>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Your year starts here!</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={160}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="poopGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="var(--brand)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--brand)" stopOpacity={0}    />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeOpacity={0.4} />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: 'var(--text-muted)', fontFamily: 'Montserrat' }}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--brand)', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Area
              type="monotone"
              dataKey="count"
              stroke="var(--brand)"
              strokeWidth={2.5}
              fill="url(#poopGrad)"
              dot={{ fill: 'var(--brand)', strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5, fill: 'var(--brand)' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  )
}