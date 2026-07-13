import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()

    // Verify Retell webhook signature (optional but recommended)
    // You can add signature verification here using Retell's webhook secret

    const supabase = await createClient()

    // Handle different webhook event types
    switch (payload.event) {
      case 'call_started':
        return await handleCallStarted(payload, supabase)
      case 'call_ended':
        return await handleCallEnded(payload, supabase)
      case 'call_analyzed':
        return await handleCallAnalyzed(payload, supabase)
      default:
        return NextResponse.json({ message: 'Event type not handled' })
    }
  } catch (error) {
    console.error('[v0] Retell webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleCallStarted(payload: any, supabase: any) {
  const { call_id, agent_id, caller_phone_number, caller_name } = payload

  // Create call record
  const { data: call, error } = await supabase.from('calls').insert([
    {
      retell_call_id: call_id,
      agent_id,
      caller_phone_number,
      caller_name: caller_name || 'Unknown',
      status: 'ongoing',
    },
  ])

  if (error) {
    console.error('[v0] Failed to create call record:', error)
    return NextResponse.json({ error: 'Failed to create call' }, { status: 500 })
  }

  return NextResponse.json({ success: true, message: 'Call started recorded' })
}

async function handleCallEnded(payload: any, supabase: any) {
  const { call_id, duration_seconds, recording_url, transcript } = payload

  // Update call record
  const { error } = await supabase
    .from('calls')
    .update({
      status: 'completed',
      duration_seconds,
      recording_url,
      transcript,
      updated_at: new Date().toISOString(),
    })
    .eq('retell_call_id', call_id)

  if (error) {
    console.error('[v0] Failed to update call record:', error)
    return NextResponse.json(
      { error: 'Failed to update call' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true, message: 'Call ended recorded' })
}

async function handleCallAnalyzed(payload: any, supabase: any) {
  const {
    call_id,
    analysis,
    qualified_lead,
    lead_data,
    agent_id,
  } = payload

  // Update call with analysis
  const { error: callError } = await supabase
    .from('calls')
    .update({
      call_analysis: analysis,
      qualified_lead,
      updated_at: new Date().toISOString(),
    })
    .eq('retell_call_id', call_id)

  if (callError) {
    console.error('[v0] Failed to update call analysis:', callError)
  }

  // If qualified lead, create lead record
  if (qualified_lead && lead_data) {
    const { data: callRecord } = await supabase
      .from('calls')
      .select('id')
      .eq('retell_call_id', call_id)
      .single()

    if (callRecord) {
      const { error: leadError } = await supabase.from('leads').insert([
        {
          agent_id,
          call_id: callRecord.id,
          customer_name: lead_data.name || 'Unknown',
          customer_email: lead_data.email,
          customer_phone: lead_data.phone,
          service_type: lead_data.service_type,
          qualified: true,
          status: 'new',
        },
      ])

      if (leadError) {
        console.error('[v0] Failed to create lead:', leadError)
      } else {
        // Create notification for qualified lead
        await supabase.from('notifications').insert([
          {
            user_id: agent_id,
            type: 'qualified',
            title: 'New Qualified Lead',
            message: `${lead_data.name} is interested in ${lead_data.service_type}`,
          },
        ])
      }
    }
  }

  return NextResponse.json({
    success: true,
    message: 'Call analysis recorded',
  })
}
