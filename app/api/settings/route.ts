import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json({ error: 'Not configured' }, { status: 500 })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's profile with business
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('business_id')
      .eq('id', user.id)
      .single()

    if (profileError || !profile?.business_id) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    // Get notification preferences
    const { data: preferences, error: prefError } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('business_id', profile.business_id)
      .single()

    if (prefError && prefError.code !== 'PGRST116') {
      throw prefError
    }

    // Get business info
    const { data: business } = await supabase
      .from('businesses')
      .select('name, phone, industry')
      .eq('id', profile.business_id)
      .single()

    return NextResponse.json({
      business,
      preferences: preferences || {
        notifications_enabled: true,
        qualified_leads_enabled: true,
        urgent_callbacks_enabled: true,
        daily_summaries_enabled: true,
        email_notifications_enabled: false,
      },
    })
  } catch (error) {
    console.error('[CrewDesk] GET /api/settings error:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json({ error: 'Not configured' }, { status: 500 })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    // Get user's profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('business_id')
      .eq('id', user.id)
      .single()

    if (profileError || !profile?.business_id) {
      return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    }

    // Update notification preferences
    if (body.preferences) {
      const { error: updateError } = await supabase
        .from('notification_preferences')
        .update({
          notifications_enabled: body.preferences.notifications_enabled,
          qualified_leads_enabled: body.preferences.qualified_leads_enabled,
          urgent_callbacks_enabled: body.preferences.urgent_callbacks_enabled,
          daily_summaries_enabled: body.preferences.daily_summaries_enabled,
          email_notifications_enabled: body.preferences.email_notifications_enabled,
          updated_at: new Date().toISOString(),
        })
        .eq('business_id', profile.business_id)

      if (updateError) {
        throw updateError
      }
    }

    // Update business info if provided
    if (body.business) {
      const { error: businessError } = await supabase
        .from('businesses')
        .update({
          name: body.business.name,
          phone: body.business.phone,
          industry: body.business.industry,
        })
        .eq('id', profile.business_id)

      if (businessError) {
        throw businessError
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[CrewDesk] PUT /api/settings error:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
