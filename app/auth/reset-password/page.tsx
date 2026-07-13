'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PhoneCall, Loader2, ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      })

      if (error) {
        setError(error.message)
        return
      }

      setSubmitted(true)
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <main className="mx-auto flex min-h-svh w-full max-w-md flex-col justify-center gap-8 px-6 py-12">
        <div className="animate-fade-up flex flex-col items-center gap-4 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <PhoneCall className="size-6" />
          </span>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Check Your Email</h1>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground text-pretty">
              We&apos;ve sent a password reset link to {email}. Click the link in your email to reset your password.
            </p>
          </div>
        </div>

        <div className="animate-fade-up text-center" style={{ animationDelay: '80ms' }}>
          <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
            <ArrowLeft className="size-4" />
            Back to sign in
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-md flex-col justify-center gap-8 px-6 py-12">
      {/* Brand */}
      <div className="animate-fade-up flex flex-col items-center gap-4 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
          <PhoneCall className="size-6" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Reset Password</h1>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground text-pretty">
            Enter your email and we&apos;ll send you a link to reset your password.
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
        <button
          type="submit"
          disabled={loading}
          className="press-scale mt-1 flex h-11 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground shadow-sm transition-opacity disabled:opacity-70"
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <div className="animate-fade-up text-center" style={{ animationDelay: '140ms' }}>
        <Link href="/auth/login" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
          <ArrowLeft className="size-4" />
          Back to sign in
        </Link>
      </div>
    </main>
  )
}
