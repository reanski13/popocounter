export default function StatCard({ label, value, subtitle, accent = false, large = false }) {
  return (
    <div className={`
      rounded-2xl p-5 flex flex-col gap-1
      ${accent
        ? 'bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800'
        : 'bg-white dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/50'
      }
      shadow-sm
    `}>
      <span className="text-xs font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500">
        {label}
      </span>
      <span className={`font-serif font-bold leading-none ${large ? 'text-5xl' : 'text-3xl'} ${accent ? 'text-rose-500 dark:text-rose-400' : 'text-stone-800 dark:text-stone-100'}`}>
        {value}
      </span>
      {subtitle && (
        <span className="text-xs text-stone-400 dark:text-stone-500 mt-1">{subtitle}</span>
      )}
    </div>
  )
}