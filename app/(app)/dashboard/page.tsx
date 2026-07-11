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
import { business, dashboardStats, leads, aiDailySummary } from '@/lib/data'
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

const kpis = [
  {
    label: "Today's Calls",
    value: dashboardStats.todaysCalls,
    icon: PhoneIncoming,
    iconClass: 'bg-primary/10 text-primary',
  },
  {
    label: 'Qualified Leads',
    value: dashboardStats.qualifiedLeads,
    icon: UserCheck,
    iconClass: 'bg-success/10 text-success',
  },
  {
    label: 'Missed Calls',
    value: dashboardStats.missedCalls,
    icon: PhoneMissed,
    iconClass: 'bg-destructive/10 text-destructive',
  },
  {
    label: 'Callbacks Needed',
    value: dashboardStats.callbacksNeeded,
    icon: PhoneCall,
    iconClass: 'bg-warning/10 text-warning',
  },
]

export default function DashboardPage() {
  const recent = leads.filter((l) => l.dateGroup === 'Today').slice(0, 4)
  const urgentCallbacks = leads.filter((l) => l.urgency === 'high' && l.status === 'callback')

  return (
    <div className="flex flex-col gap-6 px-5 pt-8">
      {/* Greeting */}
      <header className="animate-fade-up flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            {getGreeting()}, {business.ownerFirstName}
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{business.businessName}</p>
        </div>
        <NotificationsButton />
      </header>

      {/* Urgent Follow-ups */}
      {urgentCallbacks.length > 0 && (
        <section aria-label="Urgent follow-ups" className="animate-fade-up" style={{ animationDelay: '40ms' }}>
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <AlertTriangle className="size-3.5" />
              </span>
              <h2 className="text-sm font-semibold text-destructive">Urgent Follow-ups</h2>
            </div>
            <div className="flex flex-col gap-2">
              {urgentCallbacks.map((lead) => (
                <div key={lead.id} className="flex items-center gap-3 rounded-xl bg-card p-3.5 shadow-sm">
                  <Link href={`/leads/${lead.id}`} className="press-scale min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{lead.name}</p>
                    <p className="mt-0.5 truncate text-sm text-muted-foreground">{lead.reason}</p>
                  </Link>
                  <a
                    href={`tel:${lead.phone.replace(/\D/g, '')}`}
                    aria-label={`Call ${lead.name}`}
                    className="press-scale flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm"
                  >
                    <PhoneCall className="size-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* AI Summary — hero */}
      <section aria-label="Today's AI summary" className="animate-fade-up" style={{ animationDelay: '80ms' }}>
        <div className="rounded-3xl border border-primary/20 bg-primary/[0.03] p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Sparkles className="size-4" />
              </span>
              <h2 className="text-base font-semibold">Today&apos;s AI Summary</h2>
            </div>
          </div>
          <p className="text-[15px] leading-relaxed text-foreground/90 text-pretty">{aiDailySummary.text}</p>
          <Link
            href={`/leads/${aiDailySummary.recommendedLeadId}`}
            className="press-scale mt-4 flex items-center gap-3 rounded-2xl bg-primary p-4 text-primary-foreground shadow-sm"
          >
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-primary-foreground/70">
                Recommended action
              </p>
              <p className="mt-1 text-sm font-medium leading-relaxed text-pretty">
                {aiDailySummary.recommendedAction}
              </p>
            </div>
            <ArrowRight className="size-4.5 shrink-0" />
          </Link>
          <p className="mt-3 text-xs text-muted-foreground">
            Generated {aiDailySummary.generatedMinutesAgo} minutes ago
          </p>
        </div>
      </section>

      {/* KPI cards */}
      <section aria-label="Today's key metrics" className="animate-fade-up" style={{ animationDelay: '120ms' }}>
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
              <p className="text-lg font-semibold tracking-tight">{dashboardStats.avgCallDuration}</p>
              <p className="text-xs text-muted-foreground">Average Call Duration</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Activity */}
      <section aria-label="Recent activity" className="animate-fade-up" style={{ animationDelay: '160ms' }}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold">Recent Activity</h2>
          <Link href="/leads" className="text-sm font-medium text-primary">
            View all
          </Link>
        </div>
        <div className="flex flex-col gap-2.5">
          {recent.map((lead) => (
            <Link
              key={lead.id}
              href={`/leads/${lead.id}`}
              className="press-scale flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold">{lead.name}</p>
                  {lead.urgency === 'high' && (
                    <span className="size-1.5 shrink-0 rounded-full bg-destructive" aria-label="Urgent" />
                  )}
                </div>
                <p className="mt-0.5 truncate text-sm text-muted-foreground">{lead.reason}</p>
                <div className="mt-2 flex items-center gap-2">
                  <LeadStatusBadge status={lead.status} />
                  <span className="text-xs text-muted-foreground">{lead.time}</span>
                </div>
              </div>
              <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </section>

      {/* Activity Chart */}
      <section aria-label="Today's activity chart" className="animate-fade-up" style={{ animationDelay: '200ms' }}>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-1 text-base font-semibold">Today&apos;s Activity</h2>
          <p className="mb-3 text-xs text-muted-foreground">Calls answered by hour</p>
          <ActivityChart />
        </div>
      </section>
    </div>
  )
}
