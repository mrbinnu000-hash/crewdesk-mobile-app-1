import Link from 'next/link'
import { PhoneCall, CheckCircle } from 'lucide-react'

export default function SignUpSuccessPage() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-md flex-col justify-center gap-8 px-6 py-12">
      {/* Success Message */}
      <div className="animate-fade-up flex flex-col items-center gap-4 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle className="size-8" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Check Your Email</h1>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground text-pretty">
            We&apos;ve sent you a confirmation link. Click it to verify your email and start using CrewDesk.
          </p>
        </div>
      </div>

      {/* Info Card */}
      <div
        className="animate-fade-up flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm"
        style={{ animationDelay: '80ms' }}
      >
        <div className="flex gap-3">
          <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <span className="text-sm font-semibold">1</span>
          </div>
          <div>
            <p className="text-sm font-medium">Check your email</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Look for the verification email in your inbox</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <span className="text-sm font-semibold">2</span>
          </div>
          <div>
            <p className="text-sm font-medium">Click the link</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Verify your email address by clicking the link</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <span className="text-sm font-semibold">3</span>
          </div>
          <div>
            <p className="text-sm font-medium">Start using CrewDesk</p>
            <p className="mt-0.5 text-xs text-muted-foreground">You&apos;ll be redirected to your dashboard</p>
          </div>
        </div>
      </div>

      {/* Link */}
      <div
        className="animate-fade-up text-center"
        style={{ animationDelay: '140ms' }}
      >
        <p className="text-xs leading-relaxed text-muted-foreground">
          Didn&apos;t receive the email?{' '}
          <button className="font-medium text-primary hover:underline">
            Resend
          </button>
        </p>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          <Link href="/auth/login" className="font-medium text-primary hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
