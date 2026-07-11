import type { LucideIcon } from 'lucide-react'

export function EmptyState({
  icon: Icon,
  title,
  message,
}: {
  icon: LucideIcon
  title: string
  message: string
}) {
  return (
    <div className="animate-fade-up flex flex-col items-center gap-5 rounded-3xl border border-border bg-card px-6 py-14 text-center shadow-sm">
      <div className="relative flex items-center justify-center" aria-hidden="true">
        <span className="absolute size-20 rounded-full bg-primary/5" />
        <span className="absolute size-14 rounded-full bg-primary/10" />
        <span className="relative flex size-12 items-center justify-center rounded-2xl bg-card text-primary shadow-sm ring-1 ring-border">
          <Icon className="size-5" />
        </span>
      </div>
      <div>
        <p className="text-base font-semibold">{title}</p>
        <p className="mx-auto mt-1.5 max-w-[16rem] text-sm leading-relaxed text-muted-foreground text-pretty">
          {message}
        </p>
      </div>
    </div>
  )
}
