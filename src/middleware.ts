// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // The token is expected to be in a cookie named 'authToken'
  // For server-side middleware, we access cookies via request.cookies
  const token = request.cookies.get('authToken')?.value;

  if (!token) {
    // If no token, redirect to the homepage where users can select login
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If a token exists, let the request proceed.
  // Further role-based validation will be handled client-side in DashboardLayout.
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/dashboard/:path*',
    '/student/dashboard/:path*',
    '/teacher/dashboard/:path*',
  ],
};
