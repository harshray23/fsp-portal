
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // The token is expected to be in a cookie named 'authToken'
  // This cookie would have been set at login (client-side) by src/lib/auth.ts
  const token = request.cookies.get('authToken')?.value;

  if (!token) {
    // If no token, redirect to the homepage where users can select login
    // The homepage itself is not protected by this middleware.
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If a token exists, let the request proceed.
  // Further role-based validation and token content verification
  // will be handled client-side in DashboardLayout.tsx or by API routes.
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/dashboard/:path*',
    '/student/dashboard/:path*',
    '/teacher/dashboard/:path*',
  ],
};
