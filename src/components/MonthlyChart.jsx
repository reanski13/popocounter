import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-stone-800 border border-stone-100 dark:border-stone-700 rounded-xl shadow-lg px-3 py-2">
        <p className="text-xs font-bold text-stone-600 dark:text-stone-300">{label}</p>
        <p className="text-lg font-serif font-bold text-rose-500">
          {payload[0].value} <span className="text-xs font-sans font-normal text-stone-400">total</span>
        </p>
      </div>
    )
  }
  return null
}

export default function MonthlyChart({ data }) {
  return (
    <div className="bg-white dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/50 rounded-2xl p-5 shadow-sm">
      <h3 className="font-serif text-lg text-stone-700 dark:text-stone-200 mb-4">Year Overview</h3>
      <ResponsiveContainer width="100%" height={160}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="poopGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fb7185" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="rgba(0,0,0,0.04)" />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#a8a29e' }}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#fb7185', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#fb7185"
            strokeWidth={2.5}
            fill="url(#poopGradient)"
            dot={{ fill: '#fb7185', strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5, fill: '#fb7185' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}