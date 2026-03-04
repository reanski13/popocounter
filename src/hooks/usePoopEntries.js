import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import {
  startOfDay, endOfDay,
  startOfWeek, endOfWeek,
  startOfMonth, endOfMonth,
  startOfYear, endOfYear,
  format, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval,
  parseISO,
} from 'date-fns'

export function usePoopEntries() {
  const { user } = useAuth()
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch all entries for current year (enough for all stats)
  const fetchEntries = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)

    const yearStart = startOfYear(new Date()).toISOString()
    const yearEnd = endOfYear(new Date()).toISOString()

    const { data, error } = await supabase
      .from('poop_entries')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', yearStart)
      .lte('created_at', yearEnd)
      .order('created_at', { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setEntries(data || [])
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  // Add a new poop entry
  const addEntry = async ({ bristol_type = 4, note = '' }) => {
    if (!user) return { error: 'Not authenticated' }

    const { data, error } = await supabase
      .from('poop_entries')
      .insert([{ user_id: user.id, bristol_type, note: note || null }])
      .select()
      .single()

    if (!error && data) {
      setEntries(prev => [data, ...prev])
    }

    return { data, error }
  }

  // Delete an entry
  const deleteEntry = async (id) => {
    const { error } = await supabase
      .from('poop_entries')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (!error) {
      setEntries(prev => prev.filter(e => e.id !== id))
    }

    return { error }
  }

  // ─── Computed Stats ───────────────────────────────────────────────

  const now = new Date()

  // Today's count
  const todayEntries = entries.filter(e => {
    const d = parseISO(e.created_at)
    return d >= startOfDay(now) && d <= endOfDay(now)
  })

  // This week
  const weekEntries = entries.filter(e => {
    const d = parseISO(e.created_at)
    return d >= startOfWeek(now, { weekStartsOn: 1 }) && d <= endOfWeek(now, { weekStartsOn: 1 })
  })

  // This month
  const monthEntries = entries.filter(e => {
    const d = parseISO(e.created_at)
    return d >= startOfMonth(now) && d <= endOfMonth(now)
  })

  // Daily chart data for the last 7 days
  const last7Days = eachDayOfInterval({
    start: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6),
    end: now,
  }).map(day => ({
    label: format(day, 'EEE'),
    date: format(day, 'yyyy-MM-dd'),
    count: entries.filter(e => {
      const d = parseISO(e.created_at)
      return d >= startOfDay(day) && d <= endOfDay(day)
    }).length,
  }))

  // Monthly chart data for current year
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

  // Bristol type distribution
  const bristolDistribution = [1, 2, 3, 4, 5, 6, 7].map(type => ({
    type,
    count: entries.filter(e => e.bristol_type === type).length,
  }))

  // Average per day this month
  const daysInMonth = monthEntries.length > 0
    ? new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    : 1
  const avgPerDay = (monthEntries.length / Math.min(now.getDate(), daysInMonth)).toFixed(1)

  return {
    entries,
    loading,
    error,
    refetch: fetchEntries,
    addEntry,
    deleteEntry,
    // Stats
    todayCount: todayEntries.length,
    weekCount: weekEntries.length,
    monthCount: monthEntries.length,
    yearCount: entries.length,
    last7Days,
    monthlyData,
    bristolDistribution,
    avgPerDay: parseFloat(avgPerDay),
    recentEntries: entries.slice(0, 10),
  }
}