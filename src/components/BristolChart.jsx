import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#eab308', '#f97316', '#ef4444']

export default function BristolChart({ data }) {
  const hasData = data.some(d => d.count > 0)

  if (!hasData) {
    return (
      <div className="bg-white dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/50 rounded-2xl p-5 shadow-sm">
        <h3 className="font-serif text-lg text-stone-700 dark:text-stone-200 mb-2">Stool Type Distribution</h3>
        <p className="text-xs text-stone-400 dark:text-stone-500 italic">No data yet. Start logging! 💩</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/50 rounded-2xl p-5 shadow-sm">
      <h3 className="font-serif text-lg text-stone-700 dark:text-stone-200 mb-1">Stool Type Distribution</h3>
      <p className="text-xs text-stone-400 dark:text-stone-500 mb-3">Bristol Chart scale 1–7</p>

      <ResponsiveContainer width="100%" height={180}>
        <RadarChart data={data.map(d => ({ ...d, subject: `Type ${d.type}` }))}>
          <PolarGrid stroke="rgba(0,0,0,0.07)" />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#a8a29e' }} />
          <Radar
            dataKey="count"
            stroke="#fb7185"
            fill="#fb7185"
            fillOpacity={0.25}
            strokeWidth={2}
          />
          <Tooltip
            formatter={(v) => [`${v} entries`, 'Count']}
            contentStyle={{
              background: 'white', border: '1px solid #f1ede9',
              borderRadius: '12px', fontSize: '12px'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="grid grid-cols-7 gap-1 mt-2">
        {data.map(({ type, count }) => (
          <div key={type} className="text-center">
            <div className="text-[10px] font-bold text-stone-500 dark:text-stone-400">{type}</div>
            <div className="text-[10px] text-rose-400 font-serif">{count}</div>
          </div>
        ))}
      </div>
    </div>
  )
}