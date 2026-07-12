'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, Bell, AlertTriangle, Sparkles, PhoneMissed, Settings } from 'lucide-react'
import { notifications, type AppNotification } from '@/lib/data'
import { cn } from '@/lib/utils'
import { NotificationPermissionModal } from '@/components/notification-permission-modal'

const typeConfig: Record<
  AppNotification['type'],
  { icon: typeof Bell; className: string; label: string }
> = {
  qualified: { 
    icon: CheckCircle2, 
    className: 'bg-success/10 text-success', 
    label: 'New Qualified Lead'
  },
  urgent: { 
    icon: AlertTriangle, 
    className: 'bg-destructive/10 text-destructive', 
    label: 'Urgent Callback'
  },
  handled: { 
    icon: PhoneMissed, 
    className: 'bg-warning/10 text-warning', 
    label: 'Missed Call Handled'
  },
  summary: { 
    icon: Sparkles, 
    className: 'bg-primary/10 text-primary', 
    label: 'AI Summary'
  },
  daily: { 
    icon: Bell, 
    className: 'bg-secondary text-secondary-foreground', 
    label: 'Daily Summary'
  },
}

export default function NotificationsPage() {
  const [showPermission, setShowPermission] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(
    new Set(notifications.filter(n => n.unread).map(n => n.id))
  )

  // Group notifications by date
  const groupedNotifications = notifications.reduce((acc, notification) => {
    const group = notification.dateGroup
    if (!acc[group]) acc[group] = []
    acc[group].push(notification)
    return acc
  }, {} as Record<string, AppNotification[]>)

  // Order the groups
  const orderedGroups = ['Today', 'Yesterday', 'Earlier'] as const

  const handleMarkAsRead = (id: string) => {
    setUnreadNotifications(prev => {
      const newSet = new Set(prev)
      newSet.delete(id)
      return newSet
    })
  }

  const handleMarkAllAsRead = () => {
    setUnreadNotifications(new Set())
  }

  const unreadCount = unreadNotifications.size

  return (
    <div className="flex flex-col gap-5 px-5 pt-6">
      {/* Header */}
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
        </div>
        <button
          onClick={() => setShowPermission(true)}
          aria-label="Notification settings"
          className="press-scale flex size-10 items-center justify-center rounded-full border border-border bg-card shadow-sm hover:bg-secondary/50"
        >
          <Settings className="size-4.5 text-foreground" />
        </button>
      </header>

      {/* Mark all as read */}
      {unreadCount > 0 && (
        <div className="flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
          <p className="text-sm font-medium text-primary">{unreadCount} new notifications</p>
          <button
            onClick={handleMarkAllAsRead}
            className="press-scale text-xs font-semibold text-primary hover:underline"
          >
            Mark all as read
          </button>
        </div>
      )}

      {/* Notifications grouped by date */}
      <div className="flex flex-col gap-6 pb-8">
        {orderedGroups.map(dateGroup => {
          const groupNotifications = groupedNotifications[dateGroup]
          if (!groupNotifications) return null

          return (
            <section key={dateGroup} className="flex flex-col gap-2">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground px-1">
                {dateGroup}
              </h2>
              <div className="flex flex-col gap-2">
                {groupNotifications.map(notification => {
                  const cfg = typeConfig[notification.type]
                  const isUnread = unreadNotifications.has(notification.id)
                  const Icon = cfg.icon

                  return (
                    <Link
                      key={notification.id}
                      href={notification.leadId ? `/leads/${notification.leadId}` : '#'}
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="group press-scale"
                    >
                      <div
                        className={cn(
                          'flex items-start gap-3 rounded-2xl p-4 transition-colors',
                          isUnread 
                            ? 'bg-secondary/70 border border-secondary hover:bg-secondary' 
                            : 'bg-card border border-border hover:bg-secondary/30',
                        )}
                      >
                        <span className={cn('mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl', cfg.className)}>
                          <Icon className="size-4.5" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold">{notification.title}</p>
                            <span className="shrink-0 text-xs text-muted-foreground whitespace-nowrap ml-2">
                              {notification.relativetime}
                            </span>
                          </div>
                          <p className="mt-1 text-xs font-medium text-muted-foreground">
                            {notification.customerName}
                          </p>
                          <p className="mt-1 text-sm leading-relaxed text-foreground/90 text-pretty">
                            {notification.message}
                          </p>
                        </div>
                        {isUnread && (
                          <span className="mt-1 size-2.5 shrink-0 rounded-full bg-primary" aria-label="Unread" />
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>

      {/* Permission Modal */}
      {showPermission && (
        <NotificationPermissionModal onClose={() => setShowPermission(false)} />
      )}
    </div>
  )
}
