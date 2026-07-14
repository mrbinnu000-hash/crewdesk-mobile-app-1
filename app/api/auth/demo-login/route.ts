import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const cookieStore = await cookies()

    // Set demo session cookie
    cookieStore.set('demo_session', JSON.stringify(body), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[CrewDesk] Demo login error:', error)
    return NextResponse.json({ error: 'Demo login failed' }, { status: 500 })
  }
}
