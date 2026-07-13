'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { PhoneCall, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const supabase = createClient()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [validating, setValidating] = useState(true)

  useEffect(() => {
    // Verify that user has a valid session from the reset link
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/auth/login')
      }
      setValidating(false)
    })
  }, [supabase, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) {
        setError(error.message)
        return
      }

      router.push('/auth/login?message=Password updated successfully')
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (validating) {
    return (
      <main className="mx-auto flex min-h-svh w-full max-w-md flex-col items-center justify-center gap-8 px-6 py-12">
        <Loader2 className="size-8 animate-spin text-primary" />
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
          <h1 className="text-2xl font-semibold tracking-tight">Set New Password</h1>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground text-pretty">
            Enter your new password below.
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
          <label htmlFor="password" className="text-sm font-medium">
            New Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            placeholder="••••••••"
            className="h-11 rounded-xl border border-border bg-background px-3.5 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/20"
            disabled={loading}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirm-password" className="text-sm font-medium">
            Confirm Password
          </label>
          <input
            id="confirm-password"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
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
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </main>
  )
}
