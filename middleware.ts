import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function middleware(request: NextRequest) {
  // Auth routes that don't require authentication
  const authRoutes = ['/auth/login', '/auth/sign-up', '/auth/reset-password', '/auth/callback']
  const isAuthRoute = authRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  // Root path should redirect to login or dashboard based on auth status
  const isRootPath = request.nextUrl.pathname === '/'

  const cookieStore = await cookies()

  // Check if Supabase credentials are configured
  const hasSupabaseConfig =
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase is not configured, allow public routes but redirect others to login
  if (!hasSupabaseConfig) {
    if (isAuthRoute) {
      return NextResponse.next()
    }
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  try {
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

    // If on root path, redirect based on auth status
    if (isRootPath) {
      if (user) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // If user is not authenticated
    if (!user) {
      if (isAuthRoute) {
        return NextResponse.next()
      }
      // Redirect to login
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    // If user is authenticated and trying to access auth pages, redirect to dashboard
    if (isAuthRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    // If auth fails, allow auth routes through, redirect others to login
    if (isAuthRoute) {
      return NextResponse.next()
    }
    if (isRootPath) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
