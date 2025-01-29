import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Only apply to /api routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Clone the request headers
    const requestHeaders = new Headers(request.headers)
    
    // Add the bypass header
    requestHeaders.set('x-vercel-skip-toolbar', '1')

    // Return response with the modified headers
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
} 