'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
  Building2,
  Phone,
  Bell,
  Moon,
  HelpCircle,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200',
        checked ? 'bg-primary' : 'bg-secondary',
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 size-6 rounded-full bg-card shadow-sm transition-all duration-200',
          checked ? 'left-[22px]' : 'left-0.5',
        )}
      />
    </button>
  )
}

export default function SettingsPage() {
  const router = useRouter()
  const supabase = createClient()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)

  useEffect(() => setMounted(true), [])

  async function handleLogout() {
    setLoggingOut(true)
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <div className="flex flex-col gap-5 px-5 pt-8">
      <header className="animate-fade-up">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      </header>

      {/* Profile card */}
      <section className="animate-fade-up flex items-center gap-4 rounded-3xl border border-border bg-card p-5 shadow-sm" style={{ animationDelay: '60ms' }}>
        <span className="flex size-13 items-center justify-center rounded-2xl bg-primary/10 text-lg font-semibold text-primary">
          {business.ownerFirstName[0]}
        </span>
        <div className="min-w-0">
          <p className="text-base font-semibold">{business.ownerFirstName} Johnson</p>
          <p className="text-sm text-muted-foreground">{business.businessName}</p>
        </div>
      </section>

      {/* Business */}
      <section aria-label="Business settings" className="animate-fade-up" style={{ animationDelay: '120ms' }}>
        <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Business</h2>
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <button className="press-scale flex w-full items-center gap-3 border-b border-border p-4 text-left">
            <span className="flex size-9 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
              <Building2 className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">Business Information</p>
              <p className="text-xs text-muted-foreground">{business.businessName}</p>
            </div>
            <ChevronRight className="size-4 text-muted-foreground" />
          </button>
          <button className="press-scale flex w-full items-center gap-3 p-4 text-left">
            <span className="flex size-9 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
              <Phone className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">Business Phone</p>
              <p className="text-xs text-muted-foreground">{business.phone}</p>
            </div>
            <ChevronRight className="size-4 text-muted-foreground" />
          </button>
        </div>
      </section>

      {/* Preferences */}
      <section aria-label="Preferences" className="animate-fade-up" style={{ animationDelay: '180ms' }}>
        <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Preferences</h2>
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex items-center gap-3 border-b border-border p-4">
            <span className="flex size-9 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
              <Bell className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">Notifications</p>
              <p className="text-xs text-muted-foreground">New leads and urgent callbacks</p>
            </div>
            <Toggle checked={notifications} onChange={setNotifications} label="Toggle notifications" />
          </div>
          <div className="flex items-center gap-3 p-4">
            <span className="flex size-9 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
              <Moon className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">Dark Mode</p>
              <p className="text-xs text-muted-foreground">Easier on the eyes at night</p>
            </div>
            {mounted && (
              <Toggle
                checked={resolvedTheme === 'dark'}
                onChange={(v) => setTheme(v ? 'dark' : 'light')}
                label="Toggle dark mode"
              />
            )}
          </div>
        </div>
      </section>

      {/* Support */}
      <section aria-label="Support" className="animate-fade-up" style={{ animationDelay: '240ms' }}>
        <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Support</h2>
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <button className="press-scale flex w-full items-center gap-3 border-b border-border p-4 text-left">
            <span className="flex size-9 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
              <HelpCircle className="size-4" />
            </span>
            <p className="flex-1 text-sm font-medium">Help &amp; Support</p>
            <ChevronRight className="size-4 text-muted-foreground" />
          </button>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="press-scale flex w-full items-center gap-3 p-4 text-left disabled:opacity-50"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <LogOut className="size-4" />
            </span>
            <p className="flex-1 text-sm font-medium text-destructive">
              {loggingOut ? 'Logging out...' : 'Log Out'}
            </p>
          </button>
        </div>
      </section>

      <p className="pb-2 text-center text-xs text-muted-foreground">CrewDesk v1.0.0</p>
    </div>
  )
}
