import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies()

  let supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Cookie setting in middleware can be ignored
          }
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Public routes that don't require authentication
  const publicRoutes = ['/auth/login', '/auth/sign-up', '/auth/reset-password']
  const isPublicRoute = publicRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  // If user is not authenticated
  if (!user) {
    if (isPublicRoute) {
      return NextResponse.next()
    }
    // Redirect to login
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // If user is authenticated and trying to access auth pages, redirect to dashboard
  if (isPublicRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
