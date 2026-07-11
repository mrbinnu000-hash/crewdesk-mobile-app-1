'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, Pause, Download } from 'lucide-react'
import { cn } from '@/lib/utils'

function parseDuration(str: string): number {
  const match = str.match(/(\d+)m\s*(\d+)s/)
  if (!match) return 180
  return parseInt(match[1]) * 60 + parseInt(match[2])
}

function fmt(s: number) {
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

const speeds = [1, 1.25, 1.5, 2]

export function AudioPlayer({ duration }: { duration: string }) {
  const total = parseDuration(duration)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [speedIdx, setSpeedIdx] = useState(0)
  const raf = useRef<number | null>(null)
  const last = useRef<number>(0)

  useEffect(() => {
    if (!playing) {
      if (raf.current) cancelAnimationFrame(raf.current)
      return
    }
    last.current = performance.now()
    const tick = (now: number) => {
      const delta = ((now - last.current) / 1000) * speeds[speedIdx]
      last.current = now
      setProgress((p) => {
        const next = p + delta
        if (next >= total) {
          setPlaying(false)
          return 0
        }
        return next
      })
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [playing, speedIdx, total])

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setPlaying((p) => !p)}
          aria-label={playing ? 'Pause recording' : 'Play recording'}
          className="press-scale flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm"
        >
          {playing ? <Pause className="size-4.5" /> : <Play className="size-4.5 translate-x-[1px]" />}
        </button>
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <input
            type="range"
            min={0}
            max={total}
            step={1}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            aria-label="Seek recording"
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary"
            style={{
              background: `linear-gradient(to right, var(--color-primary) ${(progress / total) * 100}%, var(--color-secondary) ${(progress / total) * 100}%)`,
            }}
          />
          <div className="flex justify-between text-xs tabular-nums text-muted-foreground">
            <span>{fmt(progress)}</span>
            <span>{fmt(total)}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <button
          onClick={() => setSpeedIdx((i) => (i + 1) % speeds.length)}
          className={cn(
            'press-scale rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold tabular-nums',
            speedIdx > 0 && 'border-primary/30 text-primary',
          )}
          aria-label={`Playback speed ${speeds[speedIdx]}x`}
        >
          {speeds[speedIdx]}x
        </button>
        <button
          className="press-scale flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground"
          aria-label="Download recording"
        >
          <Download className="size-3.5" />
          Download
        </button>
      </div>
    </div>
  )
}
