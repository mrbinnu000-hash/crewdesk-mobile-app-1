'use client'

import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Bell, X, CheckCircle2 } from 'lucide-react'

interface NotificationPermissionModalProps {
  onClose: () => void
}

export function NotificationPermissionModal({ onClose }: NotificationPermissionModalProps) {
  const [granted, setGranted] = useState(false)

  const handleEnable = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        setGranted(true)
        // Show a sample notification
        new Notification('Push notifications enabled!', {
          body: 'You&apos;ll now receive notifications for new leads and urgent callbacks.',
          tag: 'notification-permission',
        })
        // Close modal after a delay
        setTimeout(onClose, 2000)
      }
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-[2px]"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-labelledby="permission-title"
        onClick={(e) => e.stopPropagation()}
        className="animate-fade-up mx-4 w-full max-w-sm rounded-3xl bg-card p-6 shadow-2xl"
      >
        {granted ? (
          <div className="flex flex-col items-center text-center gap-4">
            <div className="flex size-16 items-center justify-center rounded-full bg-success/10">
              <CheckCircle2 className="size-8 text-success" />
            </div>
            <div>
              <h2 id="permission-title" className="text-xl font-semibold">
                All set!
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Push notifications are enabled for new leads and urgent callbacks.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {/* Icon */}
            <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
              <Bell className="size-7 text-primary" />
            </div>

            {/* Content */}
            <div>
              <h2 id="permission-title" className="text-xl font-semibold">
                Enable Push Notifications?
              </h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Get notified immediately about new qualified leads and urgent callbacks so you can respond faster.
              </p>

              {/* Features */}
              <ul className="mt-4 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="mt-1 flex size-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="text-xs text-foreground/80">New Qualified Leads</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 flex size-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="text-xs text-foreground/80">Urgent Callback Requests</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 flex size-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="text-xs text-foreground/80">Daily Summaries</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <button
                onClick={handleEnable}
                className="press-scale w-full rounded-2xl bg-primary py-3.5 font-semibold text-primary-foreground shadow-sm hover:shadow-md transition-shadow"
              >
                Enable Notifications
              </button>
              <button
                onClick={onClose}
                className="press-scale w-full rounded-2xl border border-border bg-card py-3.5 font-semibold text-foreground hover:bg-secondary/50 transition-colors"
              >
                Maybe Later
              </button>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close"
              className="press-scale absolute right-4 top-4 flex size-8 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
