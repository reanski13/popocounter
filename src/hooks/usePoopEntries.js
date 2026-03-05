import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import {
  startOfDay, endOfDay,
  startOfWeek, endOfWeek,
  startOfMonth, endOfMonth,
  startOfYear, endOfYear,
  subDays, format,
  eachDayOfInterval, eachMonthOfInterval,
  parseISO, isSameDay,
} from 'date-fns'

// ─── Streak Calculator ────────────────────────────────────────────────────────
// Given a sorted (desc) list of entries, compute current streak in days.
// A streak is: consecutive calendar days (including today or yesterday)
// each with at least one entry. Resets if today AND yesterday both have no entry.
function computeStreak(entries) {
  if (!entries.length) return 0

  // Build a Set of unique date strings 'yyyy-MM-dd'
  const days = new Set(
    entries.map(e => format(parseISO(e.created_at), 'yyyy-MM-dd'))
  )

  const today = format(new Date(), 'yyyy-MM-dd')
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd')

  // Streak only counts if user logged today OR yesterday
  if (!days.has(today) && !days.has(yesterday)) return 0

  let streak = 0
  let cursor = days.has(today) ? new Date() : subDays(new Date(), 1)

  while (true) {
    const key = format(cursor, 'yyyy-MM-dd')
    if (days.has(key)) {
      streak++
      cursor = subDays(cursor, 1)
    } else {
      break
    }
  }

  return streak
}

export function usePoopEntries() {
  const { user } = useAuth()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch all entries for current year
  const fetchEntries = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)

    const yearStart = startOfYear(new Date()).toISOString()
    const yearEnd   = endOfYear(new Date()).toISOString()

    const { data, error } = await supabase
      .from('poop_entries')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', yearStart)
      .lte('created_at', yearEnd)
      .order('created_at', { ascending: false })

    if (error) setError(error.message)
    else setEntries(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetchEntries() }, [fetchEntries])

  // ─── Mutations ─────────────────────────────────────────────────────────────

  const addEntry = async ({ bristol_type = 4, note = '', drawing_data = null }) => {
    if (!user) return { error: 'Not authenticated' }

    const payload = {
      user_id: user.id,
      bristol_type,
      note: note || null,
      drawing_data: drawing_data || null,
    }

    const { data, error } = await supabase
      .from('poop_entries')
      .insert([payload])
      .select()
      .single()

    if (!error && data) setEntries(prev => [data, ...prev])
    return { data, error }
  }

  const deleteEntry = async (id) => {
    const { error } = await supabase
      .from('poop_entries')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (!error) setEntries(prev => prev.filter(e => e.id !== id))
    return { error }
  }

  // ─── Computed Stats ────────────────────────────────────────────────────────

  const now = new Date()

  const todayCount = entries.filter(e => {
    const d = parseISO(e.created_at)
    return d >= startOfDay(now) && d <= endOfDay(now)
  }).length

  const weekCount = entries.filter(e => {
    const d = parseISO(e.created_at)
    return d >= startOfWeek(now, { weekStartsOn: 1 }) && d <= endOfWeek(now, { weekStartsOn: 1 })
  }).length

  const monthEntries = entries.filter(e => {
    const d = parseISO(e.created_at)
    return d >= startOfMonth(now) && d <= endOfMonth(now)
  })

  // Daily chart — last 7 days
  const last7Days = eachDayOfInterval({
    start: subDays(now, 6),
    end: now,
  }).map(day => ({
    label: format(day, 'EEE'),
    date:  format(day, 'yyyy-MM-dd'),
    count: entries.filter(e => isSameDay(parseISO(e.created_at), day)).length,
    isToday: isSameDay(day, now),
  }))

  // Monthly chart — full year
  const monthlyData = eachMonthOfInterval({
    start: startOfYear(now),
    end: endOfYear(now),
  }).map(month => ({
    label: format(month, 'MMM'),
    count: entries.filter(e => {
      const d = parseISO(e.created_at)
      return d >= startOfMonth(month) && d <= endOfMonth(month)
    }).length,
  }))

  // Bristol distribution
  const bristolDistribution = [1, 2, 3, 4, 5, 6, 7].map(type => ({
    type,
    count: entries.filter(e => e.bristol_type === type).length,
  }))

  // Avg per day this month
  const avgPerDay = parseFloat(
    (monthEntries.length / Math.min(now.getDate(), 30)).toFixed(1)
  )

  // ─── Streak ────────────────────────────────────────────────────────────────
  const currentStreak = computeStreak(entries)

  // Longest streak (brute-force over year's data)
  const longestStreak = (() => {
    if (!entries.length) return 0
    const days = [...new Set(
      entries.map(e => format(parseISO(e.created_at), 'yyyy-MM-dd'))
    )].sort()

    let max = 1, cur = 1
    for (let i = 1; i < days.length; i++) {
      const prev = parseISO(days[i - 1])
      const curr = parseISO(days[i])
      const diff = Math.round((curr - prev) / 86400000)
      if (diff === 1) { cur++; max = Math.max(max, cur) }
      else cur = 1
    }
    return max
  })()

  return {
    entries,
    loading,
    error,
    refetch: fetchEntries,
    addEntry,
    deleteEntry,
    // Stats
    todayCount,
    weekCount,
    monthCount: monthEntries.length,
    yearCount: entries.length,
    last7Days,
    monthlyData,
    bristolDistribution,
    avgPerDay,
    currentStreak,
    longestStreak,
    recentEntries: entries.slice(0, 20),
  }
}