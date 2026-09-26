import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

/**
 * Middleware to protect admin routes
 * Checks for valid JWT token and admin role
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Routes that require authentication
  const protectedRoutes = ['/admin', '/api/products', '/api/categories', '/api/upload'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Extract token from Authorization header
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // For page routes, redirect to login
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    // For API routes, return 401
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.substring(7);
  const payload = verifyToken(token);

  if (!payload) {
    // For page routes, redirect to login
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    // For API routes, return 401
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  // Check if user is admin (for admin panel, not API)
  if (pathname.startsWith('/admin') && payload.role !== 'admin') {
    return NextResponse.redirect(new URL('/auth/unauthorized', request.url));
  }

  // Add user info to request headers for use in route handlers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', payload.id.toString());
  requestHeaders.set('x-user-email', payload.email);
  requestHeaders.set('x-user-role', payload.role);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Configure which routes to protect
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/products/:path*',
    '/api/categories/:path*',
    '/api/upload',
  ],
};
