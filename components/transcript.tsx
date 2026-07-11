'use client'

import { useState } from 'react'
import { ChevronUp, MessageSquareText } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TranscriptMessage } from '@/lib/data'

const PREVIEW_COUNT = 4

function Bubble({ msg }: { msg: TranscriptMessage }) {
  return (
    <div className={cn('flex flex-col gap-1', msg.speaker === 'customer' ? 'items-end' : 'items-start')}>
      <span className="px-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        {msg.speaker === 'ai' ? 'AI Receptionist' : 'Customer'}
      </span>
      <p
        className={cn(
          'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
          msg.speaker === 'ai'
            ? 'rounded-tl-sm bg-secondary text-secondary-foreground'
            : 'rounded-tr-sm bg-primary text-primary-foreground',
        )}
      >
        {msg.text}
      </p>
    </div>
  )
}

export function Transcript({ messages }: { messages: TranscriptMessage[] }) {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? messages : messages.slice(0, PREVIEW_COUNT)
  const hiddenCount = messages.length - PREVIEW_COUNT

  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
          <MessageSquareText className="size-3.5" />
        </span>
        <div>
          <h2 className="text-base font-semibold">Conversation</h2>
        </div>
        <span className="ml-auto text-xs text-muted-foreground">
          {messages.length} {messages.length === 1 ? 'message' : 'messages'}
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {visible.map((msg, i) => (
          <Bubble key={i} msg={msg} />
        ))}
      </div>
      {hiddenCount > 0 && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="press-scale mt-4 flex h-10 w-full items-center justify-center rounded-xl border border-border bg-card text-sm font-semibold text-primary"
        >
          View Full Conversation
        </button>
      )}
      {expanded && hiddenCount > 0 && (
        <button
          onClick={() => setExpanded(false)}
          className="press-scale mt-4 flex h-10 w-full items-center justify-center gap-1.5 rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground"
        >
          <ChevronUp className="size-4" />
          Show Less
        </button>
      )}
    </div>
  )
}
