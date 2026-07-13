'use client'

import { useEffect, useState } from 'react'
import { BarChart3, TrendingUp, Phone, Users, Clock, Target } from 'lucide-react'

interface Analytics {
  summary: {
    totalCalls: number
    completedCalls: number
    missedCalls: number
    averageDurationSeconds: number
    totalLeads: number
    qualifiedLeads: number
    conversionRatePercent: number
  }
  callsByDate: Record<string, number>
  leadsByStatus: Record<string, number>
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(7)

  useEffect(() => {
    fetchAnalytics()
  }, [days])

  async function fetchAnalytics() {
    try {
      setLoading(true)
      const response = await fetch(`/api/analytics/dashboard?days=${days}`)
      if (!response.ok) throw new Error('Failed to fetch analytics')
      const data = await response.json()
      setAnalytics(data)
    } catch (error) {
      console.error('[v0] Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Failed to load analytics</p>
      </div>
    )
  }

  const { summary } = analytics
  const averageDurationMinutes = Math.floor(summary.averageDurationSeconds / 60)
  const averageDurationSeconds = summary.averageDurationSeconds % 60

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              Analytics
            </h1>
            <div className="flex gap-2">
              {[7, 30, 90].map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    days === d
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3 px-4">
        <MetricCard
          icon={<Phone className="w-5 h-5" />}
          label="Total Calls"
          value={summary.totalCalls}
          subtext={`${summary.completedCalls} completed`}
        />
        <MetricCard
          icon={<Clock className="w-5 h-5" />}
          label="Avg Duration"
          value={`${averageDurationMinutes}m ${averageDurationSeconds}s`}
          subtext={`${summary.missedCalls} missed`}
        />
        <MetricCard
          icon={<Users className="w-5 h-5" />}
          label="Total Leads"
          value={summary.totalLeads}
          subtext={`${summary.qualifiedLeads} qualified`}
        />
        <MetricCard
          icon={<Target className="w-5 h-5" />}
          label="Conversion Rate"
          value={`${summary.conversionRatePercent}%`}
          subtext={`${summary.qualifiedLeads}/${summary.totalCalls}`}
        />
      </div>

      {/* Leads by Status */}
      {Object.keys(analytics.leadsByStatus).length > 0 && (
        <div className="px-4">
          <div className="bg-card border rounded-lg p-4 space-y-4">
            <h2 className="font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Leads by Status
            </h2>
            <div className="space-y-3">
              {Object.entries(analytics.leadsByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm capitalize text-muted-foreground">
                    {status}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-secondary rounded h-2">
                      <div
                        className="bg-primary h-full rounded"
                        style={{
                          width: `${
                            (count / summary.totalLeads) * 100 || 0
                          }%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium w-8 text-right">
                      {count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Calls */}
      {analytics.recentCalls.length > 0 && (
        <div className="px-4">
          <div className="bg-card border rounded-lg p-4 space-y-4">
            <h2 className="font-semibold">Recent Calls</h2>
            <div className="space-y-2">
              {analytics.recentCalls.map((call) => (
                <div
                  key={call.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{call.caller_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {call.caller_phone_number}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {Math.floor(call.duration_seconds / 60)}m{' '}
                      {call.duration_seconds % 60}s
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {call.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recent Leads */}
      {analytics.recentLeads.length > 0 && (
        <div className="px-4">
          <div className="bg-card border rounded-lg p-4 space-y-4">
            <h2 className="font-semibold">Recent Leads</h2>
            <div className="space-y-2">
              {analytics.recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{lead.customer_name}</p>
                    <p className="text-xs text-muted-foreground">
                      {lead.service_type}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        lead.qualified
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {lead.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface MetricCardProps {
  icon: React.ReactNode
  label: string
  value: string | number
  subtext?: string
}

function MetricCard({ icon, label, value, subtext }: MetricCardProps) {
  return (
    <div className="bg-card border rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground font-medium mb-1">
            {label}
          </p>
          <p className="text-xl font-bold">{value}</p>
          {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
        </div>
        <div className="text-muted-foreground">{icon}</div>
      </div>
    </div>
  )
}
