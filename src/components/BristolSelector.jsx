const BRISTOL_TYPES = [
  { type: 1, emoji: '🪨', label: 'Type 1', desc: 'Separate hard lumps', color: 'bg-amber-100 border-amber-300 text-amber-800' },
  { type: 2, emoji: '🍫', label: 'Type 2', desc: 'Lumpy & sausage-like', color: 'bg-amber-100 border-amber-300 text-amber-800' },
  { type: 3, emoji: '🌭', label: 'Type 3', desc: 'Sausage with cracks', color: 'bg-green-100 border-green-300 text-green-800' },
  { type: 4, emoji: '🍌', label: 'Type 4', desc: 'Smooth & soft', color: 'bg-green-100 border-green-300 text-green-800' },
  { type: 5, emoji: '☁️', label: 'Type 5', desc: 'Soft blobs', color: 'bg-yellow-100 border-yellow-300 text-yellow-800' },
  { type: 6, emoji: '💧', label: 'Type 6', desc: 'Fluffy, mushy', color: 'bg-orange-100 border-orange-300 text-orange-800' },
  { type: 7, emoji: '🌊', label: 'Type 7', desc: 'Watery, no solids', color: 'bg-red-100 border-red-300 text-red-800' },
]

export default function BristolSelector({ value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500">
        Bristol Stool Type
      </label>
      <div className="grid grid-cols-7 gap-1.5">
        {BRISTOL_TYPES.map(({ type, emoji, label, desc, color }) => (
          <button
            key={type}
            type="button"
            title={`${label}: ${desc}`}
            onClick={() => onChange(type)}
            className={`
              relative flex flex-col items-center justify-center rounded-xl border-2 p-2
              transition-all duration-150 cursor-pointer select-none
              ${value === type
                ? 'border-rose-400 bg-rose-50 dark:bg-rose-900/30 dark:border-rose-500 shadow-md scale-105'
                : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 hover:border-rose-300 hover:scale-102'
              }
            `}
          >
            <span className="text-lg leading-none">{emoji}</span>
            <span className="text-[9px] font-bold text-stone-500 dark:text-stone-400 mt-1">{type}</span>
          </button>
        ))}
      </div>
      {value && (
        <p className="text-xs text-stone-400 dark:text-stone-500 italic text-center">
          {BRISTOL_TYPES[value - 1].label}: {BRISTOL_TYPES[value - 1].desc}
        </p>
      )}
    </div>
  )
}

export { BRISTOL_TYPES }