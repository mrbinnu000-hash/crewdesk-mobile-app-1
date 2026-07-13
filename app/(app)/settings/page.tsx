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
  Loader2,
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
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  const [businessName, setBusinessName] = useState('')
  const [businessPhone, setBusinessPhone] = useState('')
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [qualifiedLeadsEnabled, setQualifiedLeadsEnabled] = useState(true)
  const [urgentCallbacksEnabled, setUrgentCallbacksEnabled] = useState(true)
  const [dailySummariesEnabled, setDailySummariesEnabled] = useState(true)
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(false)

  useEffect(() => {
    setMounted(true)
    loadSettings()
  }, [])

  async function loadSettings() {
    try {
      const res = await fetch('/api/settings')
      if (res.ok) {
        const data = await res.json()
        if (data.business) {
          setBusinessName(data.business.name || '')
          setBusinessPhone(data.business.phone || '')
        }
        if (data.preferences) {
          setNotificationsEnabled(data.preferences.notifications_enabled)
          setQualifiedLeadsEnabled(data.preferences.qualified_leads_enabled)
          setUrgentCallbacksEnabled(data.preferences.urgent_callbacks_enabled)
          setDailySummariesEnabled(data.preferences.daily_summaries_enabled)
          setEmailNotificationsEnabled(data.preferences.email_notifications_enabled)
        }
      }
    } catch (error) {
      console.error('[CrewDesk] Failed to load settings:', error)
    } finally {
      setLoading(false)
    }
  }

  async function saveSettings() {
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business: {
            name: businessName,
            phone: businessPhone,
          },
          preferences: {
            notifications_enabled: notificationsEnabled,
            qualified_leads_enabled: qualifiedLeadsEnabled,
            urgent_callbacks_enabled: urgentCallbacksEnabled,
            daily_summaries_enabled: dailySummariesEnabled,
            email_notifications_enabled: emailNotificationsEnabled,
          },
        }),
      })

      if (res.ok) {
        // Show success toast
        console.log('[CrewDesk] Settings saved successfully')
      }
    } catch (error) {
      console.error('[CrewDesk] Failed to save settings:', error)
    } finally {
      setSaving(false)
    }
  }

  async function handleLogout() {
    setLoggingOut(true)
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5 px-5 pt-8 pb-24">
      <header className="animate-fade-up">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      </header>

      <section aria-label="Business settings" className="animate-fade-up" style={{ animationDelay: '120ms' }}>
        <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Business
        </h2>
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="border-b border-border p-4">
            <label className="text-sm font-medium">Business Name</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Your Business Name"
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="p-4">
            <label className="text-sm font-medium">Business Phone</label>
            <input
              type="tel"
              value={businessPhone}
              onChange={(e) => setBusinessPhone(e.target.value)}
              placeholder="(000) 000-0000"
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </section>

      <section aria-label="Notification preferences" className="animate-fade-up" style={{ animationDelay: '180ms' }}>
        <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Notifications
        </h2>
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex items-center gap-3 border-b border-border p-4">
            <span className="flex size-9 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
              <Bell className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">Enable Notifications</p>
              <p className="text-xs text-muted-foreground">All alerts and updates</p>
            </div>
            <Toggle
              checked={notificationsEnabled}
              onChange={setNotificationsEnabled}
              label="Toggle notifications"
            />
          </div>

          {notificationsEnabled && (
            <>
              <div className="flex items-center gap-3 border-b border-border p-4">
                <div className="min-w-0 flex-1 pl-12">
                  <p className="text-sm font-medium">Qualified Leads</p>
                  <p className="text-xs text-muted-foreground">New potential customers</p>
                </div>
                <Toggle
                  checked={qualifiedLeadsEnabled}
                  onChange={setQualifiedLeadsEnabled}
                  label="Toggle qualified leads alerts"
                />
              </div>

              <div className="flex items-center gap-3 border-b border-border p-4">
                <div className="min-w-0 flex-1 pl-12">
                  <p className="text-sm font-medium">Urgent Callbacks</p>
                  <p className="text-xs text-muted-foreground">Time-sensitive requests</p>
                </div>
                <Toggle
                  checked={urgentCallbacksEnabled}
                  onChange={setUrgentCallbacksEnabled}
                  label="Toggle urgent callbacks"
                />
              </div>

              <div className="flex items-center gap-3 border-b border-border p-4">
                <div className="min-w-0 flex-1 pl-12">
                  <p className="text-sm font-medium">Daily Summaries</p>
                  <p className="text-xs text-muted-foreground">End-of-day call reports</p>
                </div>
                <Toggle
                  checked={dailySummariesEnabled}
                  onChange={setDailySummariesEnabled}
                  label="Toggle daily summaries"
                />
              </div>

              <div className="flex items-center gap-3 p-4">
                <div className="min-w-0 flex-1 pl-12">
                  <p className="text-sm font-medium">Email Notifications</p>
                  <p className="text-xs text-muted-foreground">Send via email</p>
                </div>
                <Toggle
                  checked={emailNotificationsEnabled}
                  onChange={setEmailNotificationsEnabled}
                  label="Toggle email notifications"
                />
              </div>
            </>
          )}
        </div>
      </section>

      <section aria-label="Display" className="animate-fade-up" style={{ animationDelay: '240ms' }}>
        <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Display
        </h2>
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex items-center gap-3 p-4">
            <span className="flex size-9 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
              <Moon className="size-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">Dark Mode</p>
              <p className="text-xs text-muted-foreground">Easier on the eyes</p>
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

      <button
        onClick={saveSettings}
        disabled={saving}
        className="mt-4 flex h-11 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-sm disabled:opacity-70"
      >
        {saving && <Loader2 className="size-4 animate-spin" />}
        {saving ? 'Saving...' : 'Save Settings'}
      </button>

      <section aria-label="Account" className="animate-fade-up" style={{ animationDelay: '300ms' }}>
        <h2 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Account
        </h2>
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
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
