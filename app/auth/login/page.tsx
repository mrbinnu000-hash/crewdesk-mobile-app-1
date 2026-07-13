'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { PhoneCall, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Check if Supabase is configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        setError('Supabase is not configured. Please set up your Supabase credentials.')
        setLoading(false)
        return
      }

      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
        return
      }

      router.push('/dashboard')
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
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
        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
            className="h-11 rounded-xl border border-border bg-background px-3.5 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
            disabled={loading}
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="••••••••"
            className="h-11 rounded-xl border border-border bg-background px-3.5 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
            disabled={loading}
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
        <Link
          href="/auth/reset-password"
          className="text-center text-sm font-medium text-primary hover:underline"
        >
          Forgot password?
        </Link>
      </form>

      <div className="animate-fade-up text-center" style={{ animationDelay: '140ms' }}>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/auth/sign-up" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </p>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          AI Receptionist for Local Businesses
        </p>
      </div>
    </main>
  )
}
