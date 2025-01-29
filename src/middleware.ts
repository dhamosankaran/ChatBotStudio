import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Only apply to /api routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Clone the request headers
    const requestHeaders = new Headers(request.headers)
    
    // Add the bypass header
    requestHeaders.set('x-vercel-skip-toolbar', '1')

    // Get the origin
    const origin = request.headers.get('origin') || ''
    const isVercelDeployment = request.headers.get('host')?.includes('vercel.app')
    
    // Handle CORS
    if (isVercelDeployment || origin.includes('vercel.app')) {
      requestHeaders.set('Access-Control-Allow-Origin', origin)
      requestHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      requestHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
      requestHeaders.set('Access-Control-Allow-Credentials', 'true')
    }

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: requestHeaders,
      })
    }

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