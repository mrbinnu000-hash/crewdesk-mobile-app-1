'use client'

import { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, ChevronRight, Phone, SearchX, Timer, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
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

function scoreQuality(score: number) {
  if (score >= 85) return { label: 'Hot', color: 'bg-success/10 text-success' }
  if (score >= 65) return { label: 'Warm', color: 'bg-primary/10 text-primary' }
  return { label: 'Cold', color: 'bg-muted' }
}

interface Lead {
  id: string
  customer_name: string
  customer_phone: string | null
  customer_email: string | null
  reason: string | null
  qualified: boolean
  status: string
  score: number
  urgency: string
  created_at: string
}

export default function LeadsPage() {
  const supabase = createClient()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  useEffect(() => {
    async function loadLeads() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          return
        }

        // Get user's business ID
        const { data: profile } = await supabase
          .from('profiles')
          .select('business_id')
          .eq('id', user.id)
          .single()

        if (!profile) {
          return
        }

        // Fetch leads
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .eq('business_id', profile.business_id)
          .order('created_at', { ascending: false })

        if (!error && data) {
          setLeads(data)
        }
      } catch (error) {
        console.error('[CrewDesk] Failed to load leads:', error)
      } finally {
        setLoading(false)
      }
    }

    loadLeads()
  }, [supabase])

  const filtered = useMemo(() => {
    return leads.filter((lead) => {
      const q = query.trim().toLowerCase()
      if (
        q &&
        !lead.customer_name.toLowerCase().includes(q) &&
        !(lead.reason && lead.reason.toLowerCase().includes(q)) &&
        !(lead.customer_phone && lead.customer_phone.includes(q))
      ) {
        return false
      }

      const today = new Date().toDateString()
      const leadDate = new Date(lead.created_at).toDateString()

      switch (filter) {
        case 'today':
          return leadDate === today
        case 'urgent':
          return lead.urgency === 'high'
        case 'qualified':
        case 'contacted':
        case 'won':
        case 'lost':
          return lead.status === filter
        default:
          return true
      }
    })
  }, [leads, query, filter])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-svh">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  const callStatusMap: Record<string, 'inbound' | 'outbound' | 'callback'> = {
    new: 'inbound',
    contacted: 'outbound',
    qualified: 'inbound',
    won: 'outbound',
    lost: 'callback',
  }

  return (
    <div className="flex flex-col gap-4 px-5 pt-8">
      <header className="animate-fade-up">
        <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {leads.length} {leads.length === 1 ? 'lead' : 'leads'} from inbound calls
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
          message="Nothing turned up for this search or filter. Your receptionist is still catching every call."
        />
      ) : (
        <div className="flex flex-col gap-2.5 pb-2">
          {filtered.map((lead, i) => {
            const createdDate = new Date(lead.created_at)
            const today = new Date()
            const daysAgo = Math.floor((today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
            const dateString =
              daysAgo === 0
                ? `Today, ${createdDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
                : `${daysAgo} day${daysAgo === 1 ? '' : 's'} ago`

            return (
              <Link
                key={lead.id}
                href={`/leads/${lead.id}`}
                className="press-scale animate-fade-up flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
                style={{ animationDelay: `${Math.min(i * 40, 240)}ms` }}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold">{lead.customer_name || 'Unknown'}</p>
                    {lead.urgency === 'high' && (
                      <span className="size-1.5 shrink-0 rounded-full bg-destructive" aria-label="Urgent" />
                    )}
                  </div>
                  {lead.customer_phone && (
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Phone className="size-3" />
                      {lead.customer_phone}
                    </p>
                  )}
                  {lead.reason && (
                    <p className="mt-1 truncate text-sm text-muted-foreground">{lead.reason}</p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <LeadStatusBadge status={lead.status} />
                    <CallStatusBadge status={callStatusMap[lead.status] || 'inbound'} />
                  </div>
                  <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Timer className="size-3" />
                      <span className="tabular-nums">{dateString}</span>
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
            )
          })}
        </div>
      )}
    </div>
  )
}
