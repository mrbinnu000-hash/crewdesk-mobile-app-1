import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET all calls for current user
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: calls, error } = await supabase
      .from('calls')
      .select('*')
      .eq('agent_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(calls)
  } catch (error) {
    console.error('[v0] GET /api/calls error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch calls' },
      { status: 500 }
    )
  }
}

// POST - Create a new call (for testing)
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

    const { data: call, error } = await supabase
      .from('calls')
      .insert([
        {
          agent_id: user.id,
          caller_phone_number: body.caller_phone_number,
          caller_name: body.caller_name,
          status: body.status || 'completed',
        },
      ])
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(call)
  } catch (error) {
    console.error('[v0] POST /api/calls error:', error)
    return NextResponse.json(
      { error: 'Failed to create call' },
      { status: 500 }
    )
  }
}
