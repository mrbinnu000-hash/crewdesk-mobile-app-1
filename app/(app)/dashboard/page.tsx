'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  PhoneIncoming,
  UserCheck,
  PhoneMissed,
  PhoneCall,
  Timer,
  Sparkles,
  ChevronRight,
  ArrowRight,
  AlertTriangle,
  Loader2,
} from 'lucide-react'
import { LeadStatusBadge } from '@/components/status-badge'
import { ActivityChart } from '@/components/activity-chart'
import { NotificationsButton } from '@/components/notifications'
import { cn } from '@/lib/utils'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}

const DEMO_DATA = {
  profile: {
    first_name: 'Harsh',
    business_id: 'demo-business-1',
    business_name: 'CrewDesk Demo',
  },
  analytics: {
    summary: {
      totalCalls: 24,
      qualifiedLeads: 8,
      missedCalls: 2,
      conversionRatePercent: 33,
      averageDurationSeconds: 245,
    },
    recentLeads: [
      {
        id: '1',
        customer_name: 'Sarah Johnson',
        reason: 'Roof inspection quote',
        urgency: 'high',
        status: 'new',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        customer_phone: '(555) 123-4567',
      },
      {
        id: '2',
        customer_name: 'Mike Chen',
        reason: 'Gutter cleaning',
        urgency: 'medium',
        status: 'contacted',
        created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        customer_phone: '(555) 234-5678',
      },
      {
        id: '3',
        customer_name: 'Emma Davis',
        reason: 'Insurance estimate',
        urgency: 'medium',
        status: 'qualified',
        created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        customer_phone: '(555) 345-6789',
      },
      {
        id: '4',
        customer_name: 'John Smith',
        reason: 'Follow-up estimate',
        urgency: 'low',
        status: 'won',
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        customer_phone: '(555) 456-7890',
      },
    ],
    callsByDate: {
      'Mon': 3,
      'Tue': 4,
      'Wed': 3,
      'Thu': 4,
      'Fri': 5,
      'Sat': 3,
      'Sun': 2,
    },
  },
}

export default function DashboardPage() {
  const [isDemo, setIsDemo] = useState(false)
  const [data, setData] = useState(DEMO_DATA)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadDashboard() {
      try {
        // Check if demo session exists
        const demoSession = localStorage.getItem('demo_session')
        if (demoSession) {
          setIsDemo(true)
          setData(DEMO_DATA)
          setLoading(false)
          return
        }

        // Try to fetch real data from API
        const response = await fetch('/api/analytics/dashboard')
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data')
        }

        const realData = await response.json()
        setData(realData)
        setLoading(false)
      } catch (err) {
        console.error('[v0] Dashboard error:', err)
        // Fall back to demo mode if real data fails
        setIsDemo(true)
        setData(DEMO_DATA)
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-svh">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="size-6 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error && !isDemo) {
    return (
      <div className="flex items-center justify-center min-h-svh">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  const { profile, analytics } = data

  const kpis = [
    {
      label: "Today's Calls",
      value: analytics.summary.totalCalls,
      icon: PhoneIncoming,
      iconClass: 'bg-primary/10 text-primary',
    },
    {
      label: 'Qualified Leads',
      value: analytics.summary.qualifiedLeads,
      icon: UserCheck,
      iconClass: 'bg-success/10 text-success',
    },
    {
      label: 'Missed Calls',
      value: analytics.summary.missedCalls,
      icon: PhoneMissed,
      iconClass: 'bg-destructive/10 text-destructive',
    },
    {
      label: 'Conversion Rate',
      value: `${analytics.summary.conversionRatePercent}%`,
      icon: PhoneCall,
      iconClass: 'bg-warning/10 text-warning',
    },
  ]

  const avgDuration = analytics.summary.averageDurationSeconds
  const minutes = Math.floor(avgDuration / 60)
  const seconds = avgDuration % 60
  const durationString = `${minutes}m ${seconds}s`

  const recentLeads = analytics.recentLeads.slice(0, 4)
  const urgentLeads = analytics.recentLeads.filter(
    (l) => l.urgency === 'high' && l.status !== 'won' && l.status !== 'lost'
  )

  return (
    <div className="flex flex-col gap-6 px-5 pt-8 pb-32">
      {isDemo && (
        <div className="rounded-lg bg-blue-500/10 p-3 text-sm text-blue-700 dark:text-blue-400">
          Demo Mode: Using sample data. Connect Supabase to see real call data.
        </div>
      )}

      {/* Greeting */}
      <header className="animate-fade-up flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            {getGreeting()}, {profile.first_name || 'User'}
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Last 7 days activity</p>
        </div>
        <NotificationsButton />
      </header>

      {/* Urgent Follow-ups */}
      {urgentLeads.length > 0 && (
        <section aria-label="Urgent follow-ups" className="animate-fade-up" style={{ animationDelay: '40ms' }}>
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <AlertTriangle className="size-3.5" />
              </span>
              <h2 className="text-sm font-semibold text-destructive">Urgent Follow-ups</h2>
            </div>
            <div className="flex flex-col gap-2">
              {urgentLeads.slice(0, 3).map((lead) => (
                <div key={lead.id} className="flex items-center gap-3 rounded-xl bg-card p-3.5 shadow-sm">
                  <Link href={`/leads/${lead.id}`} className="press-scale min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{lead.customer_name}</p>
                    <p className="mt-0.5 truncate text-sm text-muted-foreground">{lead.reason}</p>
                  </Link>
                  {lead.customer_phone && (
                    <a
                      href={`tel:${lead.customer_phone.replace(/\D/g, '')}`}
                      aria-label={`Call ${lead.customer_name}`}
                      className="press-scale flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm"
                    >
                      <PhoneCall className="size-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* AI Summary */}
      <section aria-label="Analytics summary" className="animate-fade-up" style={{ animationDelay: '80ms' }}>
        <div className="rounded-3xl border border-primary/20 bg-primary/[0.03] p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Sparkles className="size-4" />
              </span>
              <h2 className="text-base font-semibold">Analytics Summary</h2>
            </div>
          </div>
          <p className="text-[15px] leading-relaxed text-foreground/90 text-pretty">
            You received <strong>{analytics.summary.totalCalls}</strong> calls over the last 7 days.{' '}
            <strong>{analytics.summary.qualifiedLeads}</strong> qualified leads were generated with a{' '}
            <strong>{analytics.summary.conversionRatePercent}%</strong> conversion rate. Keep up the great work!
          </p>
          {recentLeads.length > 0 && (
            <Link
              href={`/leads/${recentLeads[0].id}`}
              className="press-scale mt-4 flex items-center gap-3 rounded-2xl bg-primary p-4 text-primary-foreground shadow-sm"
            >
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-primary-foreground/70">
                  View recent lead
                </p>
                <p className="mt-1 text-sm font-medium leading-relaxed text-pretty">
                  {recentLeads[0].customer_name}
                </p>
              </div>
              <ArrowRight className="size-4.5 shrink-0" />
            </Link>
          )}
        </div>
      </section>

      {/* KPI cards */}
      <section aria-label="Key metrics" className="animate-fade-up" style={{ animationDelay: '120ms' }}>
        <div className="grid grid-cols-2 gap-3">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm"
            >
              <span className={cn('flex size-9 items-center justify-center rounded-xl', kpi.iconClass)}>
                <kpi.icon className="size-4.5" />
              </span>
              <div>
                <p className="text-2xl font-semibold tracking-tight">{kpi.value}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{kpi.label}</p>
              </div>
            </div>
          ))}
          <div className="col-span-2 flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
            <span className="flex size-9 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
              <Timer className="size-4.5" />
            </span>
            <div>
              <p className="text-lg font-semibold tracking-tight">{durationString}</p>
              <p className="text-xs text-muted-foreground">Average Call Duration</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Leads */}
      <section aria-label="Recent leads" className="animate-fade-up" style={{ animationDelay: '160ms' }}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold">Recent Leads</h2>
          <Link href="/leads" className="text-sm font-medium text-primary">
            View all
          </Link>
        </div>
        <div className="flex flex-col gap-2.5">
          {recentLeads.length > 0 ? (
            recentLeads.map((lead) => (
              <Link
                key={lead.id}
                href={`/leads/${lead.id}`}
                className="press-scale flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold">{lead.customer_name}</p>
                    {lead.urgency === 'high' && (
                      <span className="size-1.5 shrink-0 rounded-full bg-destructive" aria-label="Urgent" />
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-sm text-muted-foreground">{lead.reason}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <LeadStatusBadge status={lead.status} />
                    <span className="text-xs text-muted-foreground">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
              </Link>
            ))
          ) : (
            <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
              <p className="text-sm text-muted-foreground">No leads yet</p>
            </div>
          )}
        </div>
      </section>

      {/* Activity Chart */}
      <section aria-label="Activity chart" className="animate-fade-up" style={{ animationDelay: '200ms' }}>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-1 text-base font-semibold">Calls Over Time</h2>
          <p className="mb-3 text-xs text-muted-foreground">Last 7 days by date</p>
          <ActivityChart data={analytics.callsByDate} />
        </div>
      </section>
    </div>
  )
}
