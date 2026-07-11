import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  Phone,
  Copy,
  MapPin,
  Sparkles,
  Timer,
  AudioLines,
  Check,
} from 'lucide-react'
import { leads } from '@/lib/data'
import { LeadStatusBadge } from '@/components/status-badge'
import { AudioPlayer } from '@/components/audio-player'
import { Transcript } from '@/components/transcript'
import { cn } from '@/lib/utils'

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const lead = leads.find((l) => l.id === id)
  if (!lead) notFound()

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
          <div className="flex shrink-0 flex-col items-center rounded-2xl bg-secondary px-3.5 py-2.5">
            <span className="text-lg font-semibold tabular-nums text-primary">{lead.score}</span>
            <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Score</span>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-secondary/60 p-3.5">
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Reason for calling</p>
          <p className="mt-1 text-sm font-medium leading-relaxed text-pretty">{lead.reason}</p>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <LeadStatusBadge status={lead.status} />
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Timer className="size-3" />
            {lead.duration}
          </span>
          {lead.urgency === 'high' && (
            <span className="rounded-full bg-destructive/10 px-2.5 py-0.5 text-xs font-medium text-destructive">
              Urgent
            </span>
          )}
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
        <ul className="flex flex-col gap-2.5">
          {lead.summary.map((line, i) => (
            <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-foreground/90">
              <span className="mt-2 size-1 shrink-0 rounded-full bg-primary/50" aria-hidden="true" />
              {line}
            </li>
          ))}
        </ul>
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

      {/* Timeline */}
      <section
        aria-label="Lead timeline"
        className="animate-fade-up rounded-3xl border border-border bg-card p-5 shadow-sm"
        style={{ animationDelay: '260ms' }}
      >
        <h2 className="mb-4 text-base font-semibold">Lead Timeline</h2>
        <ol className="flex flex-col">
          {lead.timeline.map((event, i) => (
            <li key={i} className="relative flex gap-3.5 pb-5 last:pb-0">
              {i < lead.timeline.length - 1 && (
                <span
                  className={cn(
                    'absolute left-[9px] top-6 h-[calc(100%-1rem)] w-px',
                    event.done ? 'bg-primary/30' : 'bg-border',
                  )}
                  aria-hidden="true"
                />
              )}
              <span
                className={cn(
                  'mt-0.5 flex size-[19px] shrink-0 items-center justify-center rounded-full border-2',
                  event.done
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card',
                )}
              >
                {event.done && <Check className="size-2.5" strokeWidth={3.5} />}
              </span>
              <div>
                <p className={cn('text-sm font-medium', !event.done && 'text-muted-foreground')}>{event.label}</p>
                {event.time && <p className="mt-0.5 text-xs text-muted-foreground">{event.time}</p>}
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
