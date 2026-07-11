'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Bell, UserCheck, PhoneMissed, PhoneCall, Sparkles, X } from 'lucide-react'
import { notifications, type AppNotification } from '@/lib/data'
import { cn } from '@/lib/utils'

const typeConfig: Record<
  AppNotification['type'],
  { icon: typeof Bell; className: string }
> = {
  qualified: { icon: UserCheck, className: 'bg-success/10 text-success' },
  missed: { icon: PhoneMissed, className: 'bg-destructive/10 text-destructive' },
  urgent: { icon: PhoneCall, className: 'bg-warning/10 text-warning' },
  summary: { icon: Sparkles, className: 'bg-primary/10 text-primary' },
}

export function NotificationsButton() {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const unreadCount = notifications.filter((n) => n.unread).length

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        className="press-scale relative flex size-10 items-center justify-center rounded-full border border-border bg-card shadow-sm"
      >
        <Bell className="size-4.5 text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute right-2 top-2 flex size-2 rounded-full bg-destructive ring-2 ring-card" aria-hidden="true" />
        )}
      </button>

      {open &&
        createPortal(
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end bg-foreground/20 backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
          role="presentation"
        >
          <div
            ref={panelRef}
            role="dialog"
            aria-label="Notifications"
            onClick={(e) => e.stopPropagation()}
            className="animate-fade-up mx-auto flex w-full max-w-md flex-col rounded-t-3xl bg-card pb-8 shadow-2xl"
          >
            <div className="flex items-center justify-between px-5 pb-2 pt-5">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close notifications"
                className="press-scale flex size-8 items-center justify-center rounded-full bg-secondary text-muted-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
            <ul className="flex flex-col gap-1 px-3 pt-2">
              {notifications.map((n) => {
                const cfg = typeConfig[n.type]
                return (
                  <li key={n.id}>
                    <div
                      className={cn(
                        'flex items-start gap-3 rounded-2xl p-3.5 transition-colors',
                        n.unread ? 'bg-secondary/70' : 'bg-transparent',
                      )}
                    >
                      <span className={cn('mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl', cfg.className)}>
                        <cfg.icon className="size-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold">{n.title}</p>
                          <span className="shrink-0 text-xs text-muted-foreground">{n.time}</span>
                        </div>
                        <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground text-pretty">{n.message}</p>
                      </div>
                      {n.unread && (
                        <span className="mt-2 size-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
