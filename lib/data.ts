export type LeadStatus = 'qualified' | 'callback' | 'contacted' | 'won' | 'lost'
export type CallStatus = 'answered' | 'missed' | 'voicemail'
export type Urgency = 'high' | 'medium' | 'low'

export interface TranscriptMessage {
  speaker: 'ai' | 'customer'
  text: string
}

export interface TimelineEvent {
  label: string
  time: string
  done: boolean
}

export interface Lead {
  id: string
  name: string
  phone: string
  address: string
  reason: string
  time: string
  dateGroup: 'Today' | 'Yesterday' | 'This Week'
  score: number
  status: LeadStatus
  urgency: Urgency
  duration: string
  callStatus: CallStatus
  summary: string[]
  transcript: TranscriptMessage[]
  timeline: TimelineEvent[]
}

// Demo business info - replace with actual data from database
export const business = {
  ownerFirstName: 'Business',
  businessName: 'Your Company',
  phone: '(000) 000-0000',
}

// Empty array - data should be fetched from Supabase
export const leads: Lead[] = []

export const dashboardStats = {
  todaysCalls: 0,
  qualifiedLeads: 0,
  missedCalls: 0,
  callbacksNeeded: 0,
  avgCallDuration: '0m 00s',
}

export const activityChart: { hour: string; calls: number }[] = []

export const aiDailySummary = {
  text: 'Your receptionist is ready to take calls. Data will appear once calls are received.',
  recommendedAction: 'No recommendations at this time.',
  recommendedLeadId: '',
  generatedMinutesAgo: 0,
}

export interface AppNotification {
  id: string
  type: 'qualified' | 'urgent' | 'summary' | 'handled' | 'daily'
  title: string
  message: string
  customerName: string
  time: string
  relativetime: string
  dateGroup: 'Today' | 'Yesterday' | 'Earlier'
  unread: boolean
  leadId?: string
}

// Empty array - notifications should be fetched from Supabase
export const notifications: AppNotification[] = []

export function scoreQuality(score: number): { label: string; className: string } {
  if (score >= 85) return { label: 'High Quality', className: 'bg-success/10 text-success' }
  if (score >= 65) return { label: 'Good Quality', className: 'bg-primary/10 text-primary' }
  return { label: 'Low Quality', className: 'bg-muted text-muted-foreground' }
}

export const statusConfig: Record<
  LeadStatus,
  { label: string; className: string; dot: string }
> = {
  qualified: {
    label: 'Qualified',
    className: 'bg-success/10 text-success',
    dot: 'bg-success',
  },
  callback: {
    label: 'Needs Callback',
    className: 'bg-warning/10 text-warning',
    dot: 'bg-warning',
  },
  contacted: {
    label: 'Contacted',
    className: 'bg-primary/10 text-primary',
    dot: 'bg-primary',
  },
  won: {
    label: 'Won',
    className: 'bg-success/10 text-success',
    dot: 'bg-success',
  },
  lost: {
    label: 'Lost',
    className: 'bg-muted text-muted-foreground',
    dot: 'bg-muted-foreground',
  },
}

export const callStatusConfig: Record<
  CallStatus,
  { label: string; className: string }
> = {
  answered: { label: 'Answered', className: 'bg-success/10 text-success' },
  missed: { label: 'Missed', className: 'bg-destructive/10 text-destructive' },
  voicemail: { label: 'Voicemail', className: 'bg-warning/10 text-warning' },
}
