import { cn } from '@/lib/utils'
import { statusConfig, callStatusConfig, type LeadStatus, type CallStatus } from '@/lib/data'

export function LeadStatusBadge({ status, className }: { status: LeadStatus; className?: string }) {
  const cfg = statusConfig[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        cfg.className,
        className,
      )}
    >
      <span className={cn('size-1.5 rounded-full', cfg.dot)} aria-hidden="true" />
      {cfg.label}
    </span>
  )
}

export function CallStatusBadge({ status, className }: { status: CallStatus; className?: string }) {
  const cfg = callStatusConfig[status]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        cfg.className,
        className,
      )}
    >
      {cfg.label}
    </span>
  )
}
