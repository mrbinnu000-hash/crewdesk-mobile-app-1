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

export const business = {
  ownerFirstName: 'Mike',
  businessName: "Mike's Roofing",
  phone: '(512) 555-0147',
}

export const leads: Lead[] = [
  {
    id: 'l1',
    name: 'John Smith',
    phone: '(512) 555-0198',
    address: '2418 Oakmont Dr, Austin, TX 78704',
    reason: 'Roof leak after heavy rain',
    time: '9:42 AM',
    dateGroup: 'Today',
    score: 92,
    status: 'qualified',
    urgency: 'high',
    duration: '4m 12s',
    callStatus: 'answered',
    summary: [
      'Customer reported a roof leak after heavy rain last night.',
      'Water is coming through the ceiling in the upstairs bedroom.',
      'Requested an inspection tomorrow morning if possible.',
      'Insurance claim likely — customer has State Farm.',
      'Recommended callback within one hour.',
    ],
    transcript: [
      { speaker: 'ai', text: "Thanks for calling Mike's Roofing, this is Ava. How can I help you today?" },
      { speaker: 'customer', text: "Hi, yeah — we had that big storm last night and now I've got water coming through my ceiling upstairs." },
      { speaker: 'ai', text: "I'm sorry to hear that. Let's get you taken care of quickly. Can I get your name and the address of the property?" },
      { speaker: 'customer', text: 'John Smith, 2418 Oakmont Drive in Austin.' },
      { speaker: 'ai', text: 'Got it, John. Is the leak active right now, and do you know roughly where on the roof it might be coming from?' },
      { speaker: 'customer', text: "It's dripping steadily. I think it's near the chimney — we've had issues there before." },
      { speaker: 'ai', text: 'Understood. Would tomorrow morning work for an inspection? Mike typically has early slots between 8 and 10 AM.' },
      { speaker: 'customer', text: "Tomorrow morning would be great. Also, I'll probably go through insurance for this — is that something you handle?" },
      { speaker: 'ai', text: "We work with insurance claims all the time, including State Farm. I'll flag that for Mike so he brings the claim documentation. He'll call you back within the hour to confirm the time." },
      { speaker: 'customer', text: 'Perfect, thank you so much.' },
    ],
    timeline: [
      { label: 'Lead created', time: 'Today, 9:42 AM', done: true },
      { label: 'Viewed', time: 'Today, 9:58 AM', done: true },
      { label: 'Contacted', time: '', done: false },
      { label: 'Quote sent', time: '', done: false },
      { label: 'Won / Lost', time: '', done: false },
    ],
  },
  {
    id: 'l2',
    name: 'Sarah Mitchell',
    phone: '(512) 555-0173',
    address: '901 Lakeview Blvd, Austin, TX 78732',
    reason: 'Full roof replacement estimate',
    time: '11:15 AM',
    dateGroup: 'Today',
    score: 88,
    status: 'qualified',
    urgency: 'medium',
    duration: '6m 03s',
    callStatus: 'answered',
    summary: [
      'Homeowner requesting a full roof replacement estimate.',
      'Roof is 22 years old, asphalt shingle, approximately 2,800 sq ft.',
      'Comparing quotes from two other contractors.',
      'Flexible schedule — available weekday afternoons.',
      'High-value opportunity; recommend follow-up within 24 hours.',
    ],
    transcript: [
      { speaker: 'ai', text: "Thanks for calling Mike's Roofing, this is Ava. How can I help you today?" },
      { speaker: 'customer', text: "Hi, I'm looking to get an estimate on replacing my roof. It's about 22 years old now." },
      { speaker: 'ai', text: 'Happy to set that up. Can I get your name and property address?' },
      { speaker: 'customer', text: 'Sarah Mitchell, 901 Lakeview Boulevard.' },
      { speaker: 'ai', text: 'Thanks, Sarah. Do you know roughly the square footage of the home, and is it asphalt shingle currently?' },
      { speaker: 'customer', text: "It's around 2,800 square feet, and yes, asphalt shingle. I should mention I'm getting a couple of other quotes too." },
      { speaker: 'ai', text: "That's smart — Mike is always happy to walk through exactly what's included so you can compare properly. When works best for an on-site estimate?" },
      { speaker: 'customer', text: 'Weekday afternoons are best for me.' },
      { speaker: 'ai', text: "Perfect. I've noted weekday afternoons. Mike will call you to lock in a time — likely within the day." },
    ],
    timeline: [
      { label: 'Lead created', time: 'Today, 11:15 AM', done: true },
      { label: 'Viewed', time: '', done: false },
      { label: 'Contacted', time: '', done: false },
      { label: 'Quote sent', time: '', done: false },
      { label: 'Won / Lost', time: '', done: false },
    ],
  },
  {
    id: 'l3',
    name: 'David Chen',
    phone: '(512) 555-0155',
    address: '77 Barton Springs Rd, Austin, TX 78704',
    reason: 'Urgent: tree fell on roof',
    time: '8:05 AM',
    dateGroup: 'Today',
    score: 97,
    status: 'callback',
    urgency: 'high',
    duration: '3m 40s',
    callStatus: 'answered',
    summary: [
      'A tree limb fell on the roof during last night’s storm.',
      'Visible hole in the roof deck over the garage.',
      'Customer needs emergency tarping today.',
      'Requested urgent callback as soon as possible.',
    ],
    transcript: [
      { speaker: 'ai', text: "Thanks for calling Mike's Roofing, this is Ava. How can I help you today?" },
      { speaker: 'customer', text: 'A tree limb came down on my roof last night. There is an actual hole over my garage.' },
      { speaker: 'ai', text: "That's urgent — I'm marking this as a priority. Can I get your name and address?" },
      { speaker: 'customer', text: 'David Chen, 77 Barton Springs Road.' },
      { speaker: 'ai', text: 'Thank you, David. Is anyone in danger, and is rain expected to get in?' },
      { speaker: 'customer', text: "No one's hurt, but if it rains again tonight the garage is going to flood." },
      { speaker: 'ai', text: "Understood. We can get an emergency tarp on today. Mike will call you back as soon as he's off his current job — within the hour." },
    ],
    timeline: [
      { label: 'Lead created', time: 'Today, 8:05 AM', done: true },
      { label: 'Viewed', time: 'Today, 8:20 AM', done: true },
      { label: 'Contacted', time: '', done: false },
      { label: 'Quote sent', time: '', done: false },
      { label: 'Won / Lost', time: '', done: false },
    ],
  },
  {
    id: 'l4',
    name: 'Emily Rodriguez',
    phone: '(512) 555-0132',
    address: '350 Mesa Verde Ln, Round Rock, TX 78665',
    reason: 'Gutter repair and cleaning',
    time: '1:48 PM',
    dateGroup: 'Today',
    score: 64,
    status: 'contacted',
    urgency: 'low',
    duration: '2m 51s',
    callStatus: 'answered',
    summary: [
      'Gutters overflowing at the front of the house.',
      'Likely clogged; one section pulling away from fascia.',
      'No urgency — customer flexible on timing.',
      'Good add-on candidate for seasonal maintenance plan.',
    ],
    transcript: [
      { speaker: 'ai', text: "Thanks for calling Mike's Roofing, this is Ava. How can I help you today?" },
      { speaker: 'customer', text: 'My gutters are overflowing at the front and one section looks like it is pulling away from the house.' },
      { speaker: 'ai', text: 'We can definitely help with that. Can I grab your name and address?' },
      { speaker: 'customer', text: 'Emily Rodriguez, 350 Mesa Verde Lane in Round Rock.' },
      { speaker: 'ai', text: 'Thanks, Emily. Is this urgent, or flexible on timing?' },
      { speaker: 'customer', text: "No rush at all, whenever works. Maybe sometime next week?" },
      { speaker: 'ai', text: "Perfect — I've noted next week. Someone will reach out to schedule. Anything else I can help with?" },
      { speaker: 'customer', text: "That's it, thanks!" },
    ],
    timeline: [
      { label: 'Lead created', time: 'Today, 1:48 PM', done: true },
      { label: 'Viewed', time: 'Today, 2:02 PM', done: true },
      { label: 'Contacted', time: 'Today, 2:15 PM', done: true },
      { label: 'Quote sent', time: '', done: false },
      { label: 'Won / Lost', time: '', done: false },
    ],
  },
  {
    id: 'l5',
    name: 'Robert Kowalski',
    phone: '(512) 555-0119',
    address: '12 Hillcrest Ave, Austin, TX 78731',
    reason: 'Hail damage inspection',
    time: '4:22 PM',
    dateGroup: 'Yesterday',
    score: 81,
    status: 'qualified',
    urgency: 'medium',
    duration: '5m 17s',
    callStatus: 'answered',
    summary: [
      'Neighbor had confirmed hail damage; customer wants an inspection.',
      'Roof is 12 years old, architectural shingle.',
      'Will file an insurance claim if damage is confirmed.',
      'Available any morning this week.',
    ],
    transcript: [
      { speaker: 'ai', text: "Thanks for calling Mike's Roofing, this is Ava. How can I help you today?" },
      { speaker: 'customer', text: "My neighbor just had his roof replaced from hail damage and suggested I get mine checked too." },
      { speaker: 'ai', text: 'Good thinking. Can I get your name and address for the inspection?' },
      { speaker: 'customer', text: 'Robert Kowalski, 12 Hillcrest Avenue.' },
      { speaker: 'ai', text: 'Thanks, Robert. How old is the roof, roughly?' },
      { speaker: 'customer', text: 'About 12 years. Architectural shingle. If there is damage I will go through insurance.' },
      { speaker: 'ai', text: "Noted — we handle insurance inspections regularly. What's your availability like?" },
      { speaker: 'customer', text: 'Any morning this week works.' },
      { speaker: 'ai', text: "Great. I've flagged mornings this week. Mike will call to confirm a slot." },
    ],
    timeline: [
      { label: 'Lead created', time: 'Yesterday, 4:22 PM', done: true },
      { label: 'Viewed', time: 'Yesterday, 5:01 PM', done: true },
      { label: 'Contacted', time: 'Yesterday, 5:30 PM', done: true },
      { label: 'Quote sent', time: '', done: false },
      { label: 'Won / Lost', time: '', done: false },
    ],
  },
  {
    id: 'l6',
    name: 'Linda Tran',
    phone: '(512) 555-0186',
    address: '4501 Cedar Park Way, Cedar Park, TX 78613',
    reason: 'Skylight leak repair',
    time: '10:30 AM',
    dateGroup: 'Yesterday',
    score: 76,
    status: 'won',
    urgency: 'low',
    duration: '3m 29s',
    callStatus: 'answered',
    summary: [
      'Skylight in the kitchen leaking during heavy rain.',
      'Flashing likely failed — common on this model.',
      'Quote accepted; repair scheduled for Friday.',
    ],
    transcript: [
      { speaker: 'ai', text: "Thanks for calling Mike's Roofing, this is Ava. How can I help you today?" },
      { speaker: 'customer', text: 'My kitchen skylight leaks whenever it rains hard.' },
      { speaker: 'ai', text: 'We can take care of that. Name and address, please?' },
      { speaker: 'customer', text: 'Linda Tran, 4501 Cedar Park Way.' },
      { speaker: 'ai', text: 'Thanks, Linda. How old is the skylight, do you know?' },
      { speaker: 'customer', text: 'Maybe 15 years? It came with the house.' },
      { speaker: 'ai', text: "Likely the flashing. Mike will follow up with a quote — these are usually straightforward repairs." },
    ],
    timeline: [
      { label: 'Lead created', time: 'Yesterday, 10:30 AM', done: true },
      { label: 'Viewed', time: 'Yesterday, 10:45 AM', done: true },
      { label: 'Contacted', time: 'Yesterday, 11:20 AM', done: true },
      { label: 'Quote sent', time: 'Yesterday, 2:10 PM', done: true },
      { label: 'Won', time: 'Today, 9:05 AM', done: true },
    ],
  },
  {
    id: 'l7',
    name: 'Marcus Webb',
    phone: '(512) 555-0164',
    address: '208 Travis Heights Blvd, Austin, TX 78704',
    reason: 'Shingle repair quote — went with competitor',
    time: '2:15 PM',
    dateGroup: 'This Week',
    score: 45,
    status: 'lost',
    urgency: 'low',
    duration: '2m 08s',
    callStatus: 'answered',
    summary: [
      'Requested quote for missing shingles after wind.',
      'Price-sensitive; chose a lower competitor bid.',
      'Keep on file for future seasonal outreach.',
    ],
    transcript: [
      { speaker: 'ai', text: "Thanks for calling Mike's Roofing, this is Ava. How can I help you today?" },
      { speaker: 'customer', text: 'I lost some shingles in the wind last week. Looking for a repair quote.' },
      { speaker: 'ai', text: 'We can help. Can I get your name and address?' },
      { speaker: 'customer', text: 'Marcus Webb, 208 Travis Heights Boulevard.' },
      { speaker: 'ai', text: 'Thanks, Marcus. Roughly how many shingles are missing?' },
      { speaker: 'customer', text: 'Maybe a dozen, all on the south side. I am getting a few quotes.' },
      { speaker: 'ai', text: 'Understood — Mike will follow up with a competitive quote shortly.' },
    ],
    timeline: [
      { label: 'Lead created', time: 'Tuesday, 2:15 PM', done: true },
      { label: 'Viewed', time: 'Tuesday, 3:00 PM', done: true },
      { label: 'Contacted', time: 'Tuesday, 4:45 PM', done: true },
      { label: 'Quote sent', time: 'Wednesday, 9:30 AM', done: true },
      { label: 'Lost', time: 'Thursday, 11:00 AM', done: true },
    ],
  },
  {
    id: 'l8',
    name: 'Tom Baker',
    phone: '(512) 555-0177',
    address: '1802 Windridge Dr, Austin, TX 78748',
    reason: 'Voicemail about attic ventilation',
    time: '8:50 AM',
    dateGroup: 'Today',
    score: 58,
    status: 'callback',
    urgency: 'low',
    duration: '0m 48s',
    callStatus: 'voicemail',
    summary: [
      'Caller left a voicemail asking about attic ventilation options.',
      'Mentioned the upstairs gets very hot in summer.',
      'No urgency stated — requested a callback when convenient.',
    ],
    transcript: [
      { speaker: 'customer', text: "Hi, this is Tom Baker. I'm calling about attic ventilation — my upstairs gets really hot in the summer and I've heard ridge vents can help. Could someone give me a call back when you get a chance? My number is 512-555-0177. Thanks." },
    ],
    timeline: [
      { label: 'Lead created', time: 'Today, 8:50 AM', done: true },
      { label: 'Viewed', time: '', done: false },
      { label: 'Contacted', time: '', done: false },
      { label: 'Quote sent', time: '', done: false },
      { label: 'Won / Lost', time: '', done: false },
    ],
  },
]

export const dashboardStats = {
  todaysCalls: 14,
  qualifiedLeads: 9,
  missedCalls: 3,
  callbacksNeeded: 3,
  avgCallDuration: '3m 42s',
}

export const activityChart = [
  { hour: '7 AM', calls: 0 },
  { hour: '8 AM', calls: 2 },
  { hour: '9 AM', calls: 3 },
  { hour: '10 AM', calls: 1 },
  { hour: '11 AM', calls: 2 },
  { hour: '12 PM', calls: 2 },
  { hour: '1 PM', calls: 3 },
  { hour: '2 PM', calls: 1 },
]

export const aiDailySummary = {
  text: 'Your receptionist answered 14 calls today and turned 9 of them into qualified leads. Most callers were dealing with roof leaks after last night\u2019s storm, and 3 of them asked for an urgent callback.',
  recommendedAction: 'Call David Chen first — a tree fell on his roof and he needs emergency tarping today.',
  recommendedLeadId: 'l3',
  generatedMinutesAgo: 12,
}

export interface AppNotification {
  id: string
  type: 'qualified' | 'missed' | 'urgent' | 'summary'
  title: string
  message: string
  time: string
  unread: boolean
}

export const notifications: AppNotification[] = [
  {
    id: 'n1',
    type: 'urgent',
    title: 'Urgent Callback',
    message: 'David Chen needs emergency tarping — a tree fell on his roof.',
    time: '5m ago',
    unread: true,
  },
  {
    id: 'n2',
    type: 'qualified',
    title: 'New Qualified Lead',
    message: 'Sarah Mitchell wants a full roof replacement estimate.',
    time: '32m ago',
    unread: true,
  },
  {
    id: 'n3',
    type: 'missed',
    title: 'Missed Call',
    message: '(737) 555-0201 called at 12:33 PM. No voicemail left.',
    time: '1h ago',
    unread: false,
  },
  {
    id: 'n4',
    type: 'summary',
    title: 'AI Summary Ready',
    message: 'Your daily call summary for today is ready to review.',
    time: '2h ago',
    unread: false,
  },
]

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
