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
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key',
        }
      });
    }

    // Get API keys
    const apiKey = request.headers.get('x-api-key');
    const expectedKey = process.env.INTERNAL_API_KEY;
    const publicKey = process.env.NEXT_PUBLIC_INTERNAL_API_KEY;
    
    // Debug logging (be careful not to log the full keys in production)
    console.log('Middleware - Auth Debug:', {
      hasApiKey: !!apiKey,
      apiKeyLength: apiKey?.length,
      hasExpectedKey: !!expectedKey,
      expectedKeyLength: expectedKey?.length,
      hasPublicKey: !!publicKey,
      publicKeyLength: publicKey?.length,
      url: request.url,
      method: request.method,
      isDevelopment: process.env.NODE_ENV === 'development'
    });

    // Verify API key
    if (!apiKey || !expectedKey || (apiKey !== expectedKey && apiKey !== publicKey)) {
      console.error('Middleware - Auth Failed:', {
        reason: !apiKey ? 'Missing API key' : !expectedKey ? 'Missing env var' : 'Invalid key',
        url: request.url,
        method: request.method
      });
      
      return new NextResponse(
        JSON.stringify({ 
          error: 'Unauthorized - Invalid API Key',
          details: !apiKey ? 'Missing API key' : !expectedKey ? 'Configuration error' : 'Invalid key',
          debug: {
            hasApiKey: !!apiKey,
            hasExpectedKey: !!expectedKey,
            hasPublicKey: !!publicKey,
            isDevelopment: process.env.NODE_ENV === 'development'
          }
        }),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      );
    }

    // Continue with valid API key
    const response = NextResponse.next();
    
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