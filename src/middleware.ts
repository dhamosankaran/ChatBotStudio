import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Only apply to /api routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Set bypass header for all API requests
    const headers = new Headers({
      'x-vercel-protection-bypass': 'true',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key'
    });

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { 
        status: 200,
        headers
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
            ...Object.fromEntries(headers)
          }
        }
      );
    }

    // Continue with valid API key
    const response = NextResponse.next();
    
    // Add headers to the response
    headers.forEach((value, key) => {
      response.headers.set(key, value);
    });
    
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
} 