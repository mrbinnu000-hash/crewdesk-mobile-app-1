import Link from 'next/link'
import {
  PhoneIncoming,
  UserCheck,
  PhoneMissed,
  PhoneCall,
  Timer,
  Sparkles,
  ChevronRight,
} from 'lucide-react'
import { business, dashboardStats, leads, aiDailySummary } from '@/lib/data'
import { LeadStatusBadge } from '@/components/status-badge'
import { ActivityChart } from '@/components/activity-chart'
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

  return (
    <div className="flex flex-col gap-6 px-5 pt-8">
      {/* Greeting */}
      <header className="animate-fade-up">
        <h1 className="text-2xl font-semibold tracking-tight text-balance">
          {getGreeting()}, {business.ownerFirstName}
        </h1>
        <p className="mt-0.5 text-sm text-muted-foreground">{business.businessName}</p>
      </header>

      {/* KPI cards */}
      <section aria-label="Today's key metrics" className="animate-fade-up" style={{ animationDelay: '60ms' }}>
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
      <section aria-label="Recent activity" className="animate-fade-up" style={{ animationDelay: '120ms' }}>
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

      {/* AI Summary */}
      <section aria-label="Today's AI summary" className="animate-fade-up" style={{ animationDelay: '180ms' }}>
        <div className="rounded-2xl border border-primary/15 bg-card p-5 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="size-3.5" />
            </span>
            <h2 className="text-base font-semibold">Today&apos;s AI Summary</h2>
          </div>
          <ul className="flex flex-col gap-2">
            {aiDailySummary.map((line, i) => (
              <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-foreground/90">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-primary/50" aria-hidden="true" />
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Activity Chart */}
      <section aria-label="Today's activity chart" className="animate-fade-up" style={{ animationDelay: '240ms' }}>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-1 text-base font-semibold">Today&apos;s Activity</h2>
          <p className="mb-3 text-xs text-muted-foreground">Calls answered by hour</p>
          <ActivityChart />
        </div>
      </section>
    </div>
  )
}
