import { SupabaseClient } from '@supabase/supabase-js'

/**
 * Get the current user's business ID
 */
export async function getUserBusinessId(supabase: SupabaseClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('business_id')
    .eq('id', user.id)
    .single()

  if (error || !data) {
    throw new Error('Failed to get business ID')
  }

  return data.business_id as string
}

/**
 * Get the current user's profile
 */
export async function getUserProfile(supabase: SupabaseClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    throw error
  }

  return data
}

/**
 * Get business details
 */
export async function getBusinessDetails(supabase: SupabaseClient, businessId: string) {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', businessId)
    .single()

  if (error) {
    throw error
  }

  return data
}

/**
 * Get all calls for a business
 */
export async function getBusinessCalls(
  supabase: SupabaseClient,
  businessId: string,
  limit = 100,
  offset = 0,
) {
  const { data, error, count } = await supabase
    .from('calls')
    .select('*', { count: 'exact' })
    .eq('business_id', businessId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    throw error
  }

  return { data, count }
}

/**
 * Get all leads for a business
 */
export async function getBusinessLeads(
  supabase: SupabaseClient,
  businessId: string,
  limit = 100,
  offset = 0,
) {
  const { data, error, count } = await supabase
    .from('leads')
    .select('*', { count: 'exact' })
    .eq('business_id', businessId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    throw error
  }

  return { data, count }
}

/**
 * Get a single lead with call details
 */
export async function getLead(supabase: SupabaseClient, businessId: string, leadId: string) {
  const { data, error } = await supabase
    .from('leads')
    .select('*, calls:call_id(*)')
    .eq('business_id', businessId)
    .eq('id', leadId)
    .single()

  if (error) {
    throw error
  }

  return data
}

/**
 * Get all notifications for a business
 */
export async function getBusinessNotifications(
  supabase: SupabaseClient,
  businessId: string,
  limit = 50,
) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    throw error
  }

  return data
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(
  supabase: SupabaseClient,
  businessId: string,
  notificationId: string,
) {
  const { data, error } = await supabase
    .from('notifications')
    .update({ unread: false })
    .eq('business_id', businessId)
    .eq('id', notificationId)
    .single()

  if (error) {
    throw error
  }

  return data
}

/**
 * Get analytics dashboard data
 */
export async function getDashboardAnalytics(
  supabase: SupabaseClient,
  businessId: string,
  daysBack = 7,
) {
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - daysBack)

  // Get calls
  const { data: callsData, error: callsError } = await supabase
    .from('calls')
    .select('*')
    .eq('business_id', businessId)
    .gte('created_at', startDate.toISOString())

  if (callsError) throw callsError

  // Get leads
  const { data: leadsData, error: leadsError } = await supabase
    .from('leads')
    .select('*')
    .eq('business_id', businessId)
    .gte('created_at', startDate.toISOString())

  if (leadsError) throw leadsError

  const calls = callsData || []
  const leads = leadsData || []

  // Calculate metrics
  const totalCalls = calls.length
  const completedCalls = calls.filter((c) => c.status === 'completed').length
  const missedCalls = calls.filter((c) => c.status === 'missed').length
  const totalDuration = calls.reduce((sum, c) => sum + (c.duration_seconds || 0), 0)
  const averageDuration = totalCalls > 0 ? Math.round(totalDuration / totalCalls) : 0

  const qualifiedLeads = leads.filter((l) => l.qualified).length
  const conversionRate = totalCalls > 0 ? Math.round((qualifiedLeads / totalCalls) * 100) : 0

  // Group calls by date
  const callsByDate: Record<string, number> = {}
  calls.forEach((call) => {
    const date = new Date(call.created_at).toISOString().split('T')[0]
    callsByDate[date] = (callsByDate[date] || 0) + 1
  })

  // Group leads by status
  const leadsByStatus: Record<string, number> = {}
  leads.forEach((lead) => {
    leadsByStatus[lead.status] = (leadsByStatus[lead.status] || 0) + 1
  })

  return {
    summary: {
      totalCalls,
      completedCalls,
      missedCalls,
      averageDurationSeconds: averageDuration,
      qualifiedLeads,
      conversionRatePercent: conversionRate,
    },
    callsByDate,
    leadsByStatus,
    recentCalls: calls.slice(0, 10),
    recentLeads: leads.slice(0, 10),
  }
}

/**
 * Get follow-ups for a lead
 */
export async function getFollowUps(
  supabase: SupabaseClient,
  businessId: string,
  leadId: string,
) {
  const { data, error } = await supabase
    .from('follow_ups')
    .select('*')
    .eq('business_id', businessId)
    .eq('lead_id', leadId)
    .order('order_index', { ascending: true })

  if (error) {
    throw error
  }

  return data
}

/**
 * Update follow-up item
 */
export async function updateFollowUp(
  supabase: SupabaseClient,
  businessId: string,
  followUpId: string,
  updates: { completed?: boolean; item?: string },
) {
  const { data, error } = await supabase
    .from('follow_ups')
    .update(updates)
    .eq('business_id', businessId)
    .eq('id', followUpId)
    .single()

  if (error) {
    throw error
  }

  return data
}

/**
 * Create follow-up item
 */
export async function createFollowUp(
  supabase: SupabaseClient,
  businessId: string,
  leadId: string,
  item: string,
) {
  const { data, error } = await supabase
    .from('follow_ups')
    .insert([
      {
        business_id: businessId,
        lead_id: leadId,
        item,
        order_index: 0,
      },
    ])
    .single()

  if (error) {
    throw error
  }

  return data
}

/**
 * Get notification preferences
 */
export async function getNotificationPreferences(supabase: SupabaseClient, profileId: string) {
  const { data, error } = await supabase
    .from('notification_preferences')
    .select('*')
    .eq('profile_id', profileId)
    .single()

  if (error) {
    // If no preferences exist, return defaults
    if (error.code === 'PGRST116') {
      return {
        qualified_leads: true,
        urgent_callbacks: true,
        daily_summaries: true,
        missed_calls: true,
      }
    }
    throw error
  }

  return data
}

/**
 * Update notification preferences
 */
export async function updateNotificationPreferences(
  supabase: SupabaseClient,
  profileId: string,
  preferences: {
    qualified_leads?: boolean
    urgent_callbacks?: boolean
    daily_summaries?: boolean
    missed_calls?: boolean
  },
) {
  const { data, error } = await supabase
    .from('notification_preferences')
    .update(preferences)
    .eq('profile_id', profileId)
    .single()

  if (error) {
    throw error
  }

  return data
}
