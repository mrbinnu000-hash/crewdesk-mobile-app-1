'use client'

import { useEffect, useState } from 'react'
import { Download, Loader2, AlertTriangle, Volume2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RecordingPlayerProps {
  callId: string
  className?: string
}

export function RecordingPlayer({ callId, className }: RecordingPlayerProps) {
  const [url, setUrl] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    async function fetchUrl() {
      try {
        const response = await fetch(`/api/recordings/download?callId=${callId}`)

        if (!response.ok) {
          if (response.status === 404) {
            setError('Recording not found')
          } else {
            setError('Failed to load recording')
          }
          setLoading(false)
          return
        }

        const data = await response.json()
        setUrl(data.url)
        setError('')
      } catch (err) {
        console.error('[CrewDesk] Failed to fetch recording URL:', err)
        setError('Failed to load recording')
      } finally {
        setLoading(false)
      }
    }

    fetchUrl()
  }, [callId])

  if (loading) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-2xl border border-border bg-card p-6 shadow-sm',
          className
        )}
      >
        <Loader2 className="size-5 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">Loading recording...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className={cn(
          'flex items-center gap-3 rounded-2xl border border-destructive/20 bg-destructive/5 p-4',
          className
        )}
      >
        <AlertTriangle className="size-5 shrink-0 text-destructive" />
        <div>
          <p className="text-sm font-medium text-destructive">{error}</p>
          <p className="text-xs text-muted-foreground">Recording may not be available yet</p>
        </div>
      </div>
    )
  }

  if (!url) {
    return (
      <div
        className={cn(
          'rounded-2xl border border-border bg-card p-6 text-center shadow-sm',
          className
        )}
      >
        <p className="text-sm text-muted-foreground">No recording available for this call</p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Volume2 className="size-4 text-primary" />
        <h3 className="text-sm font-semibold">Call Recording</h3>
      </div>

      {/* Audio Player */}
      <audio
        controls
        src={url}
        className="w-full"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        Your browser does not support the audio element.
      </audio>

      {/* Download Button */}
      <a
        href={url}
        download={`call-${callId}.mp3`}
        className="press-scale flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        <Download className="size-4" />
        Download Recording
      </a>

      <p className="text-xs text-muted-foreground">
        Link expires in 1 hour. Download for permanent access.
      </p>
    </div>
  )
}
