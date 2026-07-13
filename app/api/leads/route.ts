import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET all leads for current user
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const qualified = searchParams.get('qualified')

    let query = supabase
      .from('leads')
      .select('*')
      .eq('agent_id', user.id)
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    if (qualified) {
      query = query.eq('qualified', qualified === 'true')
    }

    const { data: leads, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(leads)
  } catch (error) {
    console.error('[v0] GET /api/leads error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    )
  }
}

// POST - Create a new lead
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    const { data: lead, error } = await supabase
      .from('leads')
      .insert([
        {
          agent_id: user.id,
          customer_name: body.customer_name,
          customer_email: body.customer_email,
          customer_phone: body.customer_phone,
          service_type: body.service_type,
          status: body.status || 'new',
          qualified: body.qualified || false,
        },
      ])
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(lead)
  } catch (error) {
    console.error('[v0] POST /api/leads error:', error)
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    )
  }
}
