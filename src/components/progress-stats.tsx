'use client'

import { useEffect, useState } from 'react'
import type { Progress, ProgressStats as ProgressStatsType } from '@/types/types'
import { Card } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export function ProgressStats() {
  const [stats, setStats] = useState<ProgressStatsType>({
    totalAttempts: 0,
    correctAttempts: 0,
    accuracyRate: 0,
    dailyProgress: []
  })

  useEffect(() => {
    // Calculate stats from localStorage
    const calculateStats = () => {
      const storedProgress = localStorage.getItem('progressData')
      const progressData: Progress[] = storedProgress ? JSON.parse(storedProgress) : []
      
      const now = new Date()
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now)
        date.setDate(date.getDate() - i)
        return date.toISOString().split('T')[0]
      }).reverse()

      const dailyProgress = last7Days.map(date => {
        const dayAttempts = progressData.filter(p => p.attemptDate.startsWith(date))
        return {
          date,
          attempts: dayAttempts.length,
          correct: dayAttempts.filter(p => p.correct).length
        }
      })

      const totalAttempts = progressData.length
      const correctAttempts = progressData.filter(p => p.correct).length
      const accuracyRate = totalAttempts > 0 ? correctAttempts / totalAttempts : 0

      setStats({
        totalAttempts,
        correctAttempts,
        accuracyRate,
        dailyProgress
      })
    }

    // Initial calculation
    calculateStats()

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'progressData') {
        calculateStats()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Total Attempts</h3>
          <p className="text-2xl font-bold text-foreground">{stats.totalAttempts}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Correct Answers</h3>
          <p className="text-2xl font-bold text-foreground">{stats.correctAttempts}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">Accuracy Rate</h3>
          <p className="text-2xl font-bold text-foreground">{(stats.accuracyRate * 100).toFixed(1)}%</p>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="text-lg font-medium mb-4 text-foreground">Daily Progress</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.dailyProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="attempts" stroke="#8884d8" name="Total Attempts" />
              <Line type="monotone" dataKey="correct" stroke="#82ca9d" name="Correct Answers" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
