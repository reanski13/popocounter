import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { usePoopEntries } from '../hooks/usePoopEntries'
import { useDarkMode } from '../hooks/useDarkMode'
import StatCard from '../components/StatCard'
import StreakCard from '../components/StreakCard'
import WeeklyChart from '../components/WeeklyChart'
import MonthlyChart from '../components/MonthlyChart'
import BristolChart from '../components/BristolChart'
import RecentEntries from '../components/RecentEntries'
import AddEntryModal from '../components/AddEntryModal'

const TABS = [
  { key: 'today', label: 'Today' },
  { key: 'week',  label: 'Week'  },
  { key: 'month', label: 'Month' },
  { key: 'year',  label: 'Year'  },
]

export default function Dashboard() {
  const { user, profile, signOut } = useAuth()
  const [isDark, toggleDark] = useDarkMode()
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState('today')

  const {
    loading, error,
    todayCount, weekCount, monthCount, yearCount,
    avgPerDay, last7Days, monthlyData, bristolDistribution,
    currentStreak, longestStreak,
    recentEntries, addEntry, deleteEntry,
  } = usePoopEntries()

  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'friend'

  const todayMessage = () => {
    if (todayCount === 0) return 'No visits yet today'
    if (todayCount === 1) return 'One visit so far 🌿'
    if (todayCount === 2) return 'Twice today 👍'
    if (todayCount <= 4)  return 'Very active today 💪'
    return 'Quite the day! 🚨'
  }

  return (
    <div className="min-h-screen pb-36" style={{ backgroundColor: 'var(--bg)' }}>

      {/* ── Header ──────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-40 backdrop-blur-md border-b px-4 py-3"
        style={{
          backgroundColor: 'rgba(var(--bg-card), 0.85)',
          borderColor: 'var(--border)',
          // CSS vars don't work in rgba, so we use direct value with opacity trick:
          background: isDark
            ? 'rgba(30,15,4,0.85)'
            : 'rgba(250,246,240,0.85)',
        }}
      >
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-display text-lg leading-none" style={{ color: 'var(--text-primary)' }}>
              PopoCounter 💩
            </h1>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Hey, {displayName}!
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDark}
              className="w-9 h-9 rounded-xl border flex items-center justify-center text-sm shadow-sm transition-transform hover:scale-105"
              style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' }}
              title="Toggle dark mode"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            <Link
              to="/profile"
              className="w-9 h-9 rounded-xl border flex items-center justify-center text-sm shadow-sm transition-transform hover:scale-105"
              style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' }}
              title="Profile settings"
            >
              {profile?.avatar_url
                ? <img src={profile.avatar_url} className="w-full h-full rounded-xl object-cover" alt="avatar" />
                : '👤'
              }
            </Link>
            <button
              onClick={signOut}
              className="w-9 h-9 rounded-xl border flex items-center justify-center text-sm shadow-sm transition-transform hover:scale-105"
              style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border)' }}
              title="Sign out"
            >
              👋
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 pt-5 space-y-4">

        {/* ── Hero Counter ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="card p-6 text-center relative overflow-hidden"
        >
          {/* Decorative glow */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: 'radial-gradient(circle at 50% 0%, var(--brand) 0%, transparent 70%)',
            }}
          />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
              Today's Count
            </p>
            {loading ? (
              <div className="h-24 flex items-center justify-center">
                <div className="text-3xl animate-float">💩</div>
              </div>
            ) : (
              <motion.div
                key={todayCount}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="font-display font-black text-8xl leading-none mb-2"
                style={{ color: 'var(--brand)' }}
              >
                {todayCount}
              </motion.div>
            )}
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {todayMessage()}
            </p>
          </div>
        </motion.div>

        {/* ── Streak Card ──────────────────────────────────────────── */}
        <StreakCard
          currentStreak={currentStreak}
          longestStreak={longestStreak}
          displayName={displayName}
        />

        {/* ── Tab Switcher ─────────────────────────────────────────── */}
        <div
          className="flex rounded-2xl p-1 border gap-1"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-150"
              style={{
                backgroundColor: activeTab === tab.key ? 'var(--brand)' : 'transparent',
                color: activeTab === tab.key ? 'white' : 'var(--text-muted)',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Stat Cards ───────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-2 gap-3"
          >
            {activeTab === 'today' && <>
              <StatCard label="Today" value={todayCount} subtitle="visits" accent icon="💩" />
              <StatCard label="Daily Avg" value={avgPerDay} subtitle="this month" icon="📊" />
            </>}
            {activeTab === 'week' && <>
              <StatCard label="This Week" value={weekCount} subtitle="visits" accent icon="📅" />
              <StatCard label="Daily Avg" value={(weekCount / 7).toFixed(1)} subtitle="per day" icon="📊" />
            </>}
            {activeTab === 'month' && <>
              <StatCard label="This Month" value={monthCount} subtitle="visits" accent icon="🗓️" />
              <StatCard label="Daily Avg" value={avgPerDay} subtitle="per day" icon="📊" />
            </>}
            {activeTab === 'year' && <>
              <StatCard label="This Year" value={yearCount} subtitle="total" accent icon="🏆" />
              <StatCard label="Monthly Avg" value={(yearCount / (new Date().getMonth() + 1)).toFixed(1)} subtitle="per month" icon="📊" />
            </>}
          </motion.div>
        </AnimatePresence>

        {/* ── Charts ───────────────────────────────────────────────── */}
        <WeeklyChart data={last7Days} />
        <MonthlyChart data={monthlyData} />
        <BristolChart data={bristolDistribution} />
        <RecentEntries entries={recentEntries} onDelete={deleteEntry} />

        {error && (
          <div
            className="p-3 rounded-xl text-xs text-center"
            style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}
          >
            {error}
          </div>
        )}
      </main>

      {/* ── FAB ──────────────────────────────────────────────────────── */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30">
        <motion.button
          onClick={() => setShowModal(true)}
          whileTap={{ scale: 0.94 }}
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 px-7 py-4 rounded-full text-white font-bold text-base shadow-poop-lg"
          style={{ backgroundColor: 'var(--brand)' }}
        >
          <span className="text-xl">💩</span>
          Log a Visit
        </motion.button>
      </div>

      {/* ── Modal ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <AddEntryModal
            onAdd={addEntry}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}