import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

// Retell webhook signature verification
function verifyRetellSignature(body: string, signature: string): boolean {
  const secret = process.env.RETELL_WEBHOOK_SECRET || ''

  if (!secret) {
    console.warn('[CrewDesk] RETELL_WEBHOOK_SECRET not configured - skipping signature verification')
    return true
  }

  const hash = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('base64')

  return hash === signature
}

// Idempotency key storage (in production, use Redis or database)
const processedWebhooks = new Set<string>()

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get('x-retell-signature') || ''
    const idempotencyKey = req.headers.get('x-retell-idempotency-key') || ''

    // Read and verify signature
    const body = await req.text()

    if (!verifyRetellSignature(body, signature)) {
      console.error('[CrewDesk] Invalid webhook signature')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    // Check for duplicate webhook (idempotency)
    if (idempotencyKey && processedWebhooks.has(idempotencyKey)) {
      console.log('[CrewDesk] Duplicate webhook detected, returning cached response')
      return NextResponse.json({ success: true, cached: true })
    }

    const payload = JSON.parse(body)
    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }

    const {
      call_id,
      phone_number,
      duration_seconds,
      transcript,
      recording_url,
      call_analysis,
      qualified_lead,
      customer_name,
      customer_phone,
      customer_email,
      customer_address,
      call_reason,
      urgency,
      business_id,
    } = payload

    // Get business ID from call metadata or use provided one
    let finalBusinessId = business_id

    if (!finalBusinessId && call_id) {
      // Try to find business from call_id if provided
      const { data: existingCall } = await supabase
        .from('calls')
        .select('business_id')
        .eq('call_id', call_id)
        .single()

      if (existingCall) {
        finalBusinessId = existingCall.business_id
      }
    }

    if (!finalBusinessId) {
      console.error('[CrewDesk] No business_id provided in webhook')
      return NextResponse.json({ error: 'Missing business_id' }, { status: 400 })
    }

    // Create call record
    const { data: callData, error: callError } = await supabase
      .from('calls')
      .insert([
        {
          business_id: finalBusinessId,
          call_id,
          phone_number,
          duration_seconds: duration_seconds || 0,
          transcript: transcript || null,
          recording_url: recording_url || null,
          call_analysis: call_analysis || {},
          status: 'completed',
        },
      ])
      .select()
      .single()

    if (callError) {
      throw callError
    }

    // Create lead if qualified
    if (qualified_lead && callData) {
      const { error: leadError } = await supabase.from('leads').insert([
        {
          business_id: finalBusinessId,
          call_id: callData.id,
          customer_name: customer_name || 'Unknown Customer',
          customer_phone: customer_phone || phone_number || null,
          customer_email: customer_email || null,
          customer_address: customer_address || null,
          reason: call_reason || null,
          qualified: true,
          status: 'new',
          score: 85,
          urgency: urgency || 'medium',
        },
      ])

      if (leadError) {
        console.error('[CrewDesk] Failed to create lead:', leadError)
      }

      // Create notification for qualified lead
      const { error: notifError } = await supabase.from('notifications').insert([
        {
          business_id: finalBusinessId,
          type: 'qualified',
          title: 'New Qualified Lead',
          message: `${customer_name || 'New customer'} is interested in your services.`,
          unread: true,
        },
      ])

      if (notifError) {
        console.error('[CrewDesk] Failed to create notification:', notifError)
      }
    }

    // Mark webhook as processed (for idempotency)
    if (idempotencyKey) {
      processedWebhooks.add(idempotencyKey)
      // Clean up old keys periodically (in production, use TTL)
      if (processedWebhooks.size > 10000) {
        processedWebhooks.clear()
      }
    }

    return NextResponse.json({ success: true, callId: call_id })
  } catch (error) {
    console.error('[CrewDesk] Webhook processing error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
