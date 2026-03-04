import { format, parseISO } from 'date-fns'
import { BRISTOL_TYPES } from './BristolSelector'

export default function RecentEntries({ entries, onDelete }) {
  if (!entries.length) {
    return (
      <div className="bg-white dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/50 rounded-2xl p-5 shadow-sm">
        <h3 className="font-serif text-lg text-stone-700 dark:text-stone-200 mb-2">Recent Entries</h3>
        <p className="text-xs text-stone-400 dark:text-stone-500 italic">No entries yet. Time to go! 💩</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-stone-800/60 border border-stone-100 dark:border-stone-700/50 rounded-2xl p-5 shadow-sm">
      <h3 className="font-serif text-lg text-stone-700 dark:text-stone-200 mb-4">Recent Entries</h3>
      <div className="space-y-2">
        {entries.map(entry => {
          const bristol = BRISTOL_TYPES[entry.bristol_type - 1]
          const date = parseISO(entry.created_at)
          return (
            <div
              key={entry.id}
              className="flex items-center gap-3 py-2.5 px-3 rounded-xl bg-stone-50 dark:bg-stone-700/40 group"
            >
              <span className="text-xl">{bristol?.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">
                    Type {entry.bristol_type}
                  </span>
                  <span className="text-xs text-stone-300 dark:text-stone-600">·</span>
                  <span className="text-xs text-stone-400 dark:text-stone-500">
                    {format(date, 'MMM d, h:mm a')}
                  </span>
                </div>
                {entry.note && (
                  <p className="text-xs text-stone-400 dark:text-stone-500 truncate mt-0.5 italic">
                    "{entry.note}"
                  </p>
                )}
              </div>
              <button
                onClick={() => onDelete(entry.id)}
                className="opacity-0 group-hover:opacity-100 text-stone-300 hover:text-red-400 transition-all text-xs px-1"
                title="Delete entry"
              >
                ✕
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}