import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Only apply to /api routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { 
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key'
        }
      });
    }

    // Get API key from header
    const apiKey = request.headers.get('x-api-key');
    const expectedKey = process.env.INTERNAL_API_KEY;
    
    // Debug logging (be careful not to log the full keys in production)
    console.log('Middleware - Auth Debug:', {
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey?.length,
      hasExpectedKey: !!expectedKey,
      expectedKeyLength: expectedKey?.length,
      keysMatch: apiKey === expectedKey,
      method: request.method,
      contentType: request.headers.get('content-type'),
      url: request.url
    });

    // Verify API key
    if (!apiKey || !expectedKey || apiKey !== expectedKey) {
      console.error('Middleware - Auth Failed:', {
        reason: !apiKey ? 'Missing API key' : !expectedKey ? 'Missing env var' : 'Keys do not match',
        method: request.method,
        contentType: request.headers.get('content-type')
      });
      
      return new NextResponse(
        JSON.stringify({ 
          error: 'Unauthorized',
          message: 'Invalid API key'
        }),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key'
          }
        }
      );
    }

    // Clone the request to modify headers
    const modifiedRequest = new Request(request.url, {
      method: request.method,
      headers: new Headers(request.headers),
      body: request.body,
      cache: request.cache,
      credentials: request.credentials,
      integrity: request.integrity,
      keepalive: request.keepalive,
      mode: request.mode,
      redirect: request.redirect,
      referrer: request.referrer,
      referrerPolicy: request.referrerPolicy,
      signal: request.signal,
    });

    // Add bypass header to the request
    modifiedRequest.headers.set('x-custom-auth', 'true');
    
    // Continue with valid API key
    const response = NextResponse.next({
      request: modifiedRequest
    });
    
    // Add CORS headers to the response
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key');
    
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
} 