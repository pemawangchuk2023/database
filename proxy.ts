import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

/**
 * Next.js 16 Proxy - Handles authentication and route protection
 */
export async function proxy(request: NextRequest) {
    // Get session from Better Auth using the request
    const session = await auth.api.getSession({
        headers: request.headers
    })

    const { pathname } = request.nextUrl

    // Define public routes that don't require authentication
    const publicRoutes = [
        '/',
        '/auth/login',
        '/auth/register',
        '/auth/forgot-password',
        '/auth/reset-password',
    ]

    // Check if the current path is a public route
    const isPublicRoute = publicRoutes.some(route =>
        pathname === route || pathname.startsWith(route + '/')
    )

    // Redirect unauthenticated users to login when accessing protected routes
    if (!session?.user && !isPublicRoute) {
        const loginUrl = new URL('/auth/login', request.url)
        // Preserve the original URL for post-login redirect
        loginUrl.searchParams.set('from', pathname)
        return NextResponse.redirect(loginUrl)
    }

    // Redirect authenticated users away from auth pages to dashboard
    if (session?.user && pathname.startsWith('/auth/')) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Allow the request to proceed
    return NextResponse.next()
}

/**
 * Matcher configuration - specifies which routes the proxy should run on
 * Excludes: API routes, static files, images
 */
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
