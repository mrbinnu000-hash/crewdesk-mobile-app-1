'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Search, ChevronRight, Phone, SearchX, Timer } from 'lucide-react'
import { leads, scoreQuality, type LeadStatus } from '@/lib/data'
import { LeadStatusBadge, CallStatusBadge } from '@/components/status-badge'
import { EmptyState } from '@/components/empty-state'
import { cn } from '@/lib/utils'

type Filter = 'all' | 'today' | 'urgent' | 'qualified' | 'contacted' | 'won' | 'lost'

const filters: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'today', label: 'Today' },
  { key: 'urgent', label: 'Urgent' },
  { key: 'qualified', label: 'Qualified' },
  { key: 'contacted', label: 'Contacted' },
  { key: 'won', label: 'Won' },
  { key: 'lost', label: 'Lost' },
]

function scoreColor(score: number) {
  if (score >= 85) return 'text-success'
  if (score >= 65) return 'text-primary'
  return 'text-muted-foreground'
}

export default function LeadsPage() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = useMemo(() => {
    return leads.filter((lead) => {
      const q = query.trim().toLowerCase()
      if (
        q &&
        !lead.name.toLowerCase().includes(q) &&
        !lead.reason.toLowerCase().includes(q) &&
        !lead.phone.includes(q)
      ) {
        return false
      }
      switch (filter) {
        case 'today':
          return lead.dateGroup === 'Today'
        case 'urgent':
          return lead.urgency === 'high'
        case 'qualified':
        case 'contacted':
        case 'won':
        case 'lost':
          return lead.status === (filter as LeadStatus)
        default:
          return true
      }
    })
  }, [query, filter])

  return (
    <div className="flex flex-col gap-4 px-5 pt-8">
      <header className="animate-fade-up">
        <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {leads.length} calls turned into leads by your receptionist
        </p>
      </header>

      {/* Search */}
      <div className="animate-fade-up relative" style={{ animationDelay: '60ms' }}>
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search leads..."
          aria-label="Search leads"
          className="h-11 w-full rounded-2xl border border-border bg-card pl-10 pr-4 text-sm shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
        />
      </div>

      {/* Filters */}
      <div
        className="animate-fade-up no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5"
        style={{ animationDelay: '90ms' }}
        role="tablist"
        aria-label="Filter leads"
      >
        {filters.map((f) => (
          <button
            key={f.key}
            role="tab"
            aria-selected={filter === f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              'press-scale shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              filter === f.key
                ? 'bg-primary text-primary-foreground'
                : 'border border-border bg-card text-muted-foreground hover:text-foreground',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Lead list */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No leads match that"
          message="Nothing turned up for this search or filter. Try broadening it — your receptionist is still catching every call."
        />
      ) : (
        <div className="flex flex-col gap-2.5 pb-2">
          {filtered.map((lead, i) => (
            <Link
              key={lead.id}
              href={`/leads/${lead.id}`}
              className="press-scale animate-fade-up flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
              style={{ animationDelay: `${Math.min(i * 40, 240)}ms` }}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold">{lead.name}</p>
                  {lead.urgency === 'high' && (
                    <span className="size-1.5 shrink-0 rounded-full bg-destructive" aria-label="Urgent" />
                  )}
                </div>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Phone className="size-3" />
                  {lead.phone}
                </p>
                <p className="mt-1 truncate text-sm text-muted-foreground">{lead.reason}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <LeadStatusBadge status={lead.status} />
                  <CallStatusBadge status={lead.callStatus} />
                </div>
                <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Timer className="size-3" />
                    <span className="tabular-nums">{lead.duration}</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {lead.dateGroup === 'Today' ? `Today, ${lead.time}` : `${lead.dateGroup}, ${lead.time}`}
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <div className="flex flex-col items-end gap-0.5">
                  <span className={cn('text-sm font-semibold tabular-nums', scoreColor(lead.score))}>
                    {lead.score}
                  </span>
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {scoreQuality(lead.score).label}
                  </span>
                </div>
                <ChevronRight className="size-4 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
