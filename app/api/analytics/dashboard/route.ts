import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get date range from query params (default last 7 days)
    const { searchParams } = new URL(req.url)
    const days = parseInt(searchParams.get('days') || '7', 10)
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Fetch calls data
    const { data: callsData, error: callsError } = await supabase
      .from('calls')
      .select('*')
      .eq('agent_id', user.id)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })

    if (callsError) {
      throw callsError
    }

    // Fetch leads data
    const { data: leadsData, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .eq('agent_id', user.id)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })

    if (leadsError) {
      throw leadsError
    }

    // Calculate analytics
    const analytics = calculateAnalytics(callsData || [], leadsData || [])

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('[v0] GET /api/analytics/dashboard error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

function calculateAnalytics(calls: any[], leads: any[]) {
  const totalCalls = calls.length
  const completedCalls = calls.filter((c) => c.status === 'completed').length
  const missedCalls = calls.filter((c) => c.status === 'missed').length
  const totalDuration = calls.reduce((sum, c) => sum + (c.duration_seconds || 0), 0)
  const averageDuration = totalCalls > 0 ? Math.round(totalDuration / totalCalls) : 0

  const totalLeads = leads.length
  const qualifiedLeads = leads.filter((l) => l.qualified).length
  const conversionRate =
    totalCalls > 0 ? Math.round((qualifiedLeads / totalCalls) * 100) : 0

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
      totalLeads,
      qualifiedLeads,
      conversionRatePercent: conversionRate,
    },
    callsByDate,
    leadsByStatus,
    recentCalls: calls.slice(0, 10),
    recentLeads: leads.slice(0, 10),
  }
}
