import { createClient } from '@/lib/supabase/server'
import { getRecordingUrl } from '@/lib/supabase/storage'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/recordings/download?callId=xxx
 * 
 * Generates a signed URL for downloading a call recording.
 * Only accessible by authenticated users in the same business as the call.
 */
export async function GET(req: NextRequest) {
  try {
    const callId = req.nextUrl.searchParams.get('callId')

    if (!callId) {
      return NextResponse.json({ error: 'Missing callId parameter' }, { status: 400 })
    }

    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 })
    }

    // Get authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's business ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('business_id')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Verify the call belongs to user's business
    const { data: call } = await supabase
      .from('calls')
      .select('id')
      .eq('call_id', callId)
      .eq('business_id', profile.business_id)
      .single()

    if (!call) {
      return NextResponse.json({ error: 'Call not found or access denied' }, { status: 404 })
    }

    // Generate signed URL for recording
    const { url, error } = await getRecordingUrl(supabase, profile.business_id, callId)

    if (error) {
      return NextResponse.json({ error: 'Failed to generate download URL' }, { status: 500 })
    }

    return NextResponse.json({ url })
  } catch (error) {
    console.error('[CrewDesk] Recording download error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process request' },
      { status: 500 }
    )
  }
}
