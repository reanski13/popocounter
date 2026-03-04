import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { usePoopEntries } from '../hooks/usePoopEntries'
import { useDarkMode } from '../hooks/useDarkMode'
import StatCard from '../components/StatCard'
import WeeklyChart from '../components/WeeklyChart'
import MonthlyChart from '../components/MonthlyChart'
import BristolChart from '../components/BristolChart'
import RecentEntries from '../components/RecentEntries'
import AddEntryModal from '../components/AddEntryModal'

export default function Dashboard() {
  const { user, signOut } = useAuth()
  const [isDark, toggleDark] = useDarkMode()
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState('today') // today | week | month | year

  const {
    loading, error,
    todayCount, weekCount, monthCount, yearCount,
    avgPerDay, last7Days, monthlyData, bristolDistribution,
    recentEntries, addEntry, deleteEntry,
  } = usePoopEntries()

  const tabs = [
    { key: 'today', label: 'Today' },
    { key: 'week',  label: 'Week'  },
    { key: 'month', label: 'Month' },
    { key: 'year',  label: 'Year'  },
  ]

  return (
    <div className="min-h-screen bg-cream dark:bg-stone-950 pb-32">

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-cream/80 dark:bg-stone-950/80 backdrop-blur-md border-b border-stone-100 dark:border-stone-800/50 px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-serif text-xl font-bold text-stone-800 dark:text-stone-100 leading-none">
              PopoCounter 💩
            </h1>
            <p className="text-[11px] text-stone-400 dark:text-stone-600 mt-0.5">
              {user?.email}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDark}
              className="w-9 h-9 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center text-base shadow-sm hover:scale-105 transition-transform"
              title="Toggle dark mode"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            {/* Sign out */}
            <button
              onClick={signOut}
              className="w-9 h-9 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center text-base shadow-sm hover:scale-105 transition-transform"
              title="Sign out"
            >
              👋
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-5 space-y-5">

        {/* Hero today count */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm p-6 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-amber-50 dark:from-rose-900/10 dark:to-amber-900/10 opacity-60" />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-2">
              Today's Count
            </p>
            <div className="font-serif text-8xl font-bold text-rose-400 dark:text-rose-400 leading-none mb-1">
              {loading ? '…' : todayCount}
            </div>
            <p className="text-sm text-stone-400 dark:text-stone-500">
              {todayCount === 0 && 'No visits yet today'}
              {todayCount === 1 && 'One visit so far 🌿'}
              {todayCount === 2 && 'Twice today 👍'}
              {todayCount >= 3 && todayCount <= 4 && 'Very active today 💪'}
              {todayCount >= 5 && 'Quite the day! 🚨'}
            </p>
          </div>
        </div>

        {/* Tab stats */}
        <div className="flex bg-white dark:bg-stone-800/60 rounded-2xl p-1 border border-stone-100 dark:border-stone-700/50 shadow-sm gap-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-150
                ${activeTab === tab.key
                  ? 'bg-rose-400 dark:bg-rose-500 text-white shadow-sm'
                  : 'text-stone-400 dark:text-stone-500 hover:text-stone-600'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Stat cards */}
        {activeTab === 'today' && (
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="Today" value={todayCount} accent large subtitle="visits" />
            <StatCard label="Daily Avg" value={avgPerDay} subtitle={`this month`} />
          </div>
        )}
        {activeTab === 'week' && (
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="This Week" value={weekCount} accent subtitle="visits" />
            <StatCard label="Daily Avg" value={(weekCount / 7).toFixed(1)} subtitle="per day" />
          </div>
        )}
        {activeTab === 'month' && (
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="This Month" value={monthCount} accent subtitle="visits" />
            <StatCard label="Daily Avg" value={avgPerDay} subtitle="per day" />
          </div>
        )}
        {activeTab === 'year' && (
          <div className="grid grid-cols-2 gap-3">
            <StatCard label="This Year" value={yearCount} accent subtitle="total visits" />
            <StatCard label="Monthly Avg" value={(yearCount / (new Date().getMonth() + 1)).toFixed(1)} subtitle="per month" />
          </div>
        )}

        {/* Charts */}
        <WeeklyChart data={last7Days} />
        <MonthlyChart data={monthlyData} />
        <BristolChart data={bristolDistribution} />
        <RecentEntries entries={recentEntries} onDelete={deleteEntry} />

        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-xs text-red-500 text-center">
            {error}
          </div>
        )}
      </main>

      {/* Floating Add Button */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30">
        <button
          onClick={() => setShowModal(true)}
          className="
            flex items-center gap-2 px-7 py-4 rounded-full
            bg-rose-400 hover:bg-rose-500 dark:bg-rose-500 dark:hover:bg-rose-600
            text-white font-bold text-base
            shadow-2xl shadow-rose-200 dark:shadow-rose-900/40
            active:scale-95 transition-all duration-200
            hover:shadow-rose-300 dark:hover:shadow-rose-800/50
          "
        >
          <span className="text-xl">💩</span>
          Log a Visit
        </button>
      </div>

      {/* Add Entry Modal */}
      {showModal && (
        <AddEntryModal
          onAdd={addEntry}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}