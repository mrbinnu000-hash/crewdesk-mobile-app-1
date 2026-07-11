'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { TranscriptMessage } from '@/lib/data'

export function Transcript({ messages }: { messages: TranscriptMessage[] }) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="press-scale flex w-full items-center justify-between rounded-2xl border border-border bg-card p-4 text-left shadow-sm"
      >
        <div>
          <p className="text-sm font-semibold">Conversation Transcript</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{messages.length} messages</p>
        </div>
        <ChevronDown
          className={cn('size-4 text-muted-foreground transition-transform duration-300', open && 'rotate-180')}
        />
      </button>
      {open && (
        <div className="animate-fade-up mt-2.5 flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
          {messages.map((msg, i) => (
            <div key={i} className={cn('flex flex-col gap-1', msg.speaker === 'customer' ? 'items-end' : 'items-start')}>
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
          ))}
        </div>
      )}
    </div>
  )
}
