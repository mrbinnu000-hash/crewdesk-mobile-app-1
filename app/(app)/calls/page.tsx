'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Search,
  PhoneIncoming,
  PhoneMissed,
  Voicemail,
  AudioLines,
  FileText,
  ChevronRight,
  PhoneOff,
} from 'lucide-react'
import { calls, type CallStatus } from '@/lib/data'
import { CallStatusBadge } from '@/components/status-badge'
import { EmptyState } from '@/components/empty-state'
import { cn } from '@/lib/utils'

type Filter = 'today' | 'week' | 'month' | 'answered' | 'missed' | 'voicemail'

const filters: { key: Filter; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
  { key: 'answered', label: 'Answered' },
  { key: 'missed', label: 'Missed' },
  { key: 'voicemail', label: 'Voicemail' },
]

const statusIcons: Record<CallStatus, typeof PhoneIncoming> = {
  answered: PhoneIncoming,
  missed: PhoneMissed,
  voicemail: Voicemail,
}

const statusIconClasses: Record<CallStatus, string> = {
  answered: 'bg-success/10 text-success',
  missed: 'bg-destructive/10 text-destructive',
  voicemail: 'bg-warning/10 text-warning',
}

export default function CallsPage() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('month')

  const filtered = useMemo(() => {
    return calls.filter((call) => {
      const q = query.trim().toLowerCase()
      if (
        q &&
        !call.name.toLowerCase().includes(q) &&
        !call.reason.toLowerCase().includes(q) &&
        !call.phone.includes(q)
      ) {
        return false
      }
      switch (filter) {
        case 'today':
          return call.dateGroup === 'Today'
        case 'week':
        case 'month':
          return true
        case 'answered':
        case 'missed':
        case 'voicemail':
          return call.status === filter
      }
    })
  }, [query, filter])

  const groups = useMemo(() => {
    const order = ['Today', 'Yesterday', 'This Week'] as const
    return order
      .map((g) => ({ group: g, items: filtered.filter((c) => c.dateGroup === g) }))
      .filter((g) => g.items.length > 0)
  }, [filtered])

  return (
    <div className="flex flex-col gap-4 px-5 pt-8">
      <header className="animate-fade-up">
        <h1 className="text-2xl font-semibold tracking-tight">Calls</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">Every call handled by your receptionist</p>
      </header>

      {/* Search */}
      <div className="animate-fade-up relative" style={{ animationDelay: '60ms' }}>
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search calls..."
          aria-label="Search calls"
          className="h-11 w-full rounded-2xl border border-border bg-card pl-10 pr-4 text-sm shadow-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
        />
      </div>

      {/* Filters */}
      <div
        className="animate-fade-up no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5"
        style={{ animationDelay: '90ms' }}
        role="tablist"
        aria-label="Filter calls"
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

      {/* Timeline */}
      {groups.length === 0 ? (
        <EmptyState
          icon={PhoneOff}
          title="No calls to show"
          message="Nothing matches this search or filter. When the phone rings, every call will show up here automatically."
        />
      ) : (
        <div className="flex flex-col gap-5 pb-2">
          {groups.map(({ group, items }) => (
            <section key={group} aria-label={group}>
              <h2 className="mb-2.5 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {group}
              </h2>
              <div className="flex flex-col gap-2.5">
                {items.map((call, i) => {
                  const Icon = statusIcons[call.status]
                  const inner = (
                    <>
                      <span
                        className={cn(
                          'flex size-10 shrink-0 items-center justify-center rounded-xl',
                          statusIconClasses[call.status],
                        )}
                      >
                        <Icon className="size-4.5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold">{call.name}</p>
                          <span className="shrink-0 text-xs text-muted-foreground">{call.time}</span>
                        </div>
                        <p className="mt-0.5 truncate text-sm text-muted-foreground">{call.reason}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <CallStatusBadge status={call.status} />
                          {call.duration !== '—' && (
                            <span className="text-xs tabular-nums text-muted-foreground">{call.duration}</span>
                          )}
                          {call.hasRecording && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <AudioLines className="size-3" />
                              <span className="sr-only">Has recording</span>
                            </span>
                          )}
                          {call.hasTranscript && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <FileText className="size-3" />
                              <span className="sr-only">Has transcript</span>
                            </span>
                          )}
                        </div>
                      </div>
                      {call.leadId && <ChevronRight className="size-4 shrink-0 text-muted-foreground" />}
                    </>
                  )

                  const cardClass = cn(
                    'animate-fade-up flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm',
                    call.leadId && 'press-scale transition-shadow hover:shadow-md',
                  )
                  const delay = { animationDelay: `${Math.min(i * 40, 240)}ms` }

                  return call.leadId ? (
                    <Link key={call.id} href={`/leads/${call.leadId}`} className={cardClass} style={delay}>
                      {inner}
                    </Link>
                  ) : (
                    <div key={call.id} className={cardClass} style={delay}>
                      {inner}
                    </div>
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
