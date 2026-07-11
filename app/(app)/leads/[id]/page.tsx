import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  Phone,
  Copy,
  MapPin,
  Sparkles,
  Timer,
  Clock,
  AudioLines,
  ListChecks,
} from 'lucide-react'
import { leads, scoreQuality } from '@/lib/data'
import { LeadStatusBadge, CallStatusBadge } from '@/components/status-badge'
import { AudioPlayer } from '@/components/audio-player'
import { Transcript } from '@/components/transcript'
import { FollowUpChecklist } from '@/components/follow-up-checklist'
import { cn } from '@/lib/utils'

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const lead = leads.find((l) => l.id === id)
  if (!lead) notFound()

  const quality = scoreQuality(lead.score)

  return (
    <div className="flex flex-col gap-5 px-5 pt-6">
      {/* Back */}
      <Link
        href="/leads"
        className="press-scale flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground"
      >
        <ArrowLeft className="size-4" />
        Leads
      </Link>

      {/* Hero card */}
      <section className="animate-fade-up rounded-3xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold tracking-tight text-balance">{lead.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{lead.phone}</p>
            <p className="mt-0.5 flex items-start gap-1.5 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 size-3.5 shrink-0" />
              {lead.address}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-center gap-1 rounded-2xl bg-secondary/60 px-3.5 py-2.5">
            <span
              className={cn(
                'rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
                quality.className,
              )}
            >
              {quality.label}
            </span>
            <span className="text-lg font-semibold tabular-nums">{lead.score}</span>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-secondary/60 p-3.5">
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Reason for calling</p>
          <p className="mt-1 text-sm font-medium leading-relaxed text-pretty">{lead.reason}</p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <LeadStatusBadge status={lead.status} />
          <CallStatusBadge status={lead.callStatus} />
          {lead.urgency === 'high' && (
            <span className="rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
              Urgent
            </span>
          )}
        </div>
        <div className="mt-2.5 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Timer className="size-3" />
            <span className="tabular-nums">{lead.duration}</span>
          </span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {lead.dateGroup === 'Today' ? `Today, ${lead.time}` : `${lead.dateGroup}, ${lead.time}`}
          </span>
        </div>

        {/* Actions */}
        <div className="mt-5 grid grid-cols-3 gap-2.5">
          <a
            href={`tel:${lead.phone.replace(/\D/g, '')}`}
            className="press-scale flex flex-col items-center gap-1.5 rounded-2xl bg-primary py-3 text-primary-foreground shadow-sm"
          >
            <Phone className="size-4.5" />
            <span className="text-xs font-medium">Call</span>
          </a>
          <button className="press-scale flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-card py-3 text-foreground">
            <Copy className="size-4.5" />
            <span className="text-xs font-medium">Copy Number</span>
          </button>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(lead.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="press-scale flex flex-col items-center gap-1.5 rounded-2xl border border-border bg-card py-3 text-foreground"
          >
            <MapPin className="size-4.5" />
            <span className="text-xs font-medium">Open Maps</span>
          </a>
        </div>
      </section>

      {/* AI Summary */}
      <section
        aria-label="AI summary"
        className="animate-fade-up rounded-3xl border border-primary/15 bg-card p-5 shadow-sm"
        style={{ animationDelay: '80ms' }}
      >
        <div className="mb-3 flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="size-3.5" />
          </span>
          <h2 className="text-base font-semibold">AI Summary</h2>
        </div>
        <p className="text-sm leading-relaxed text-foreground/90 text-pretty">{lead.summary.join(' ')}</p>
      </section>

      {/* Recording */}
      <section
        aria-label="Call recording"
        className="animate-fade-up rounded-3xl border border-border bg-card p-5 shadow-sm"
        style={{ animationDelay: '140ms' }}
      >
        <div className="mb-4 flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
            <AudioLines className="size-3.5" />
          </span>
          <h2 className="text-base font-semibold">Call Recording</h2>
        </div>
        <AudioPlayer duration={lead.duration} />
      </section>

      {/* Transcript */}
      <section aria-label="Conversation transcript" className="animate-fade-up" style={{ animationDelay: '200ms' }}>
        <Transcript messages={lead.transcript} />
      </section>

      {/* Follow-up Checklist */}
      <section
        aria-label="Follow-up checklist"
        className="animate-fade-up rounded-3xl border border-border bg-card p-5 shadow-sm"
        style={{ animationDelay: '260ms' }}
      >
        <div className="mb-3 flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
            <ListChecks className="size-3.5" />
          </span>
          <h2 className="text-base font-semibold">Follow-up Checklist</h2>
        </div>
        <FollowUpChecklist status={lead.status} />
      </section>
    </div>
  )
}
