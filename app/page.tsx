'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PhoneCall, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => router.push('/dashboard'), 600)
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-md flex-col justify-center gap-8 px-6 py-12">
      {/* Brand */}
      <div className="animate-fade-up flex flex-col items-center gap-4 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
          <PhoneCall className="size-6" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">CrewDesk</h1>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground text-pretty">
            Your AI receptionist answers every call.
            <br />
            You see exactly what to do next.
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="animate-fade-up flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm"
        style={{ animationDelay: '80ms' }}
      >
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            defaultValue="mike@mikesroofing.com"
            autoComplete="email"
            className="h-11 rounded-xl border border-border bg-background px-3.5 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            defaultValue="password"
            autoComplete="current-password"
            className="h-11 rounded-xl border border-border bg-background px-3.5 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="press-scale mt-1 flex h-11 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-opacity disabled:opacity-70"
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        <button type="button" className="text-center text-sm font-medium text-primary">
          Forgot password?
        </button>
      </form>

      <p
        className="animate-fade-up text-center text-xs leading-relaxed text-muted-foreground"
        style={{ animationDelay: '140ms' }}
      >
        Enterprise-grade call handling for local businesses.
      </p>
    </main>
  )
}
