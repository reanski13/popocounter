import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-stone-800 border border-stone-100 dark:border-stone-700 rounded-xl shadow-lg px-3 py-2">
        <p className="text-xs font-bold text-stone-600 dark:text-stone-300">{label}</p>
        <p className="text-lg font-serif font-bold text-rose-500">
          {payload[0].value} <span className="text-xs font-sans font-normal text-stone-400">visits</span>
        </p>
      </div>
    )
  }
  return null
}

export default function WeeklyChart({ data }) {
  const max = Math.max(...data.map(d => d.count), 1)

  return (
    <div className="bg-white dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/50 rounded-2xl p-5 shadow-sm">
      <h3 className="font-serif text-lg text-stone-700 dark:text-stone-200 mb-4">Last 7 Days</h3>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} barCategoryGap="30%">
          <CartesianGrid vertical={false} stroke="rgba(0,0,0,0.04)" />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: '#a8a29e' }}
          />
          <YAxis hide domain={[0, max + 1]} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(244,63,94,0.06)', radius: 8 }} />
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.count === max && max > 0 ? '#fb7185' : '#fecdd3'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}