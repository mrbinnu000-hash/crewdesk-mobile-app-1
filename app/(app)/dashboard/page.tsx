export const dynamic = 'force-dynamic'

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
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getDashboardAnalytics, getUserProfile } from '@/lib/supabase/queries'
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

export default async function DashboardPage() {
  const supabase = await createClient()

  if (!supabase) {
    return (
      <div className="flex items-center justify-center min-h-svh">
        <p className="text-red-600">Failed to connect to database</p>
      </div>
    )
  }

  const profile = await getUserProfile(supabase)

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-svh">
        <p className="text-red-600">Failed to load profile</p>
      </div>
    )
  }

  try {
    const analytics = await getDashboardAnalytics(supabase, profile.business_id, 7)

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
      <div className="flex flex-col gap-6 px-5 pt-8">
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

        {/* AI Summary — hero */}
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
  } catch (error) {
    console.error('[CrewDesk] Dashboard error:', error)
    return (
      <div className="flex items-center justify-center min-h-svh">
        <p className="text-red-600">Failed to load dashboard data</p>
      </div>
    )
  }
}
