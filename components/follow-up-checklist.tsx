'use client'

import { useState } from 'react'
import { Check, Loader2 } from 'lucide-react'
import type { LeadStatus } from '@/lib/data'
import { cn } from '@/lib/utils'

const steps = [
  'Contacted Customer',
  'Estimate Scheduled',
  'Quote Sent',
  'Job Won',
  'Lost Lead',
] as const

function initialChecked(status: LeadStatus): boolean[] {
  switch (status) {
    case 'contacted':
      return [true, false, false, false, false]
    case 'won':
      return [true, true, true, true, false]
    case 'lost':
      return [true, false, true, false, true]
    default:
      return [false, false, false, false, false]
  }
}

export function FollowUpChecklist({ status }: { status: LeadStatus }) {
  const [checked, setChecked] = useState<boolean[]>(() => initialChecked(status))
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function toggle(i: number) {
    setChecked((prev) => prev.map((c, idx) => (idx === i ? !c : c)))
    setDirty(true)
    setSaved(false)
  }

  function save() {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setDirty(false)
      setSaved(true)
    }, 700)
  }

  return (
    <div>
      <ul className="flex flex-col">
        {steps.map((label, i) => (
          <li key={label}>
            <button
              onClick={() => toggle(i)}
              role="checkbox"
              aria-checked={checked[i]}
              className="press-scale flex w-full items-center gap-3.5 rounded-xl px-1 py-2.5 text-left"
            >
              <span
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-lg border-2 transition-colors',
                  checked[i]
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card',
                )}
              >
                {checked[i] && <Check className="size-3.5" strokeWidth={3} />}
              </span>
              <span
                className={cn(
                  'text-sm font-medium transition-colors',
                  checked[i] ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                {label}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={save}
        disabled={!dirty || saving}
        className={cn(
          'press-scale mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold shadow-sm transition-colors',
          saved && !dirty
            ? 'bg-success/10 text-success'
            : 'bg-primary text-primary-foreground disabled:opacity-50',
        )}
      >
        {saving && <Loader2 className="size-4 animate-spin" />}
        {saved && !dirty && <Check className="size-4" />}
        {saving ? 'Saving...' : saved && !dirty ? 'Changes Saved' : 'Save Changes'}
      </button>
    </div>
  )
}
