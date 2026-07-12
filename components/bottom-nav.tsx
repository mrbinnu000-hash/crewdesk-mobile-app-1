'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutGrid, Users, Bell, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { href: '/leads', label: 'Leads', icon: Users },
  { href: '/notifications', label: 'Notifications', icon: Bell },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto flex max-w-md items-stretch justify-around">
        {tabs.map((tab) => {
          const active = pathname === tab.href || pathname.startsWith(tab.href + '/')
          const Icon = tab.icon
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'press-scale flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors',
                active ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Icon className="size-5" strokeWidth={active ? 2.4 : 2} />
              {tab.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
