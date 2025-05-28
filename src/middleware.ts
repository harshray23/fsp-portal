
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // The token is expected to be in a cookie named 'authToken'
  // This cookie is set client-side by src/lib/auth.ts upon Firebase login.
  const token = request.cookies.get('authToken')?.value;

  // In a production environment with HttpOnly session cookies set by a backend:
  // 1. The cookie would be named differently (e.g., '__session').
  // 2. This middleware (or an API route called by it) would ideally use Firebase Admin SDK
  //    to verify the session cookie (`admin.auth().verifySessionCookie(token, true)`).
  //    This cryptographic verification is crucial. Checking only for existence is not enough for production.
  // For this prototype, we only check for the cookie's presence. Client-side logic in
  // DashboardLayout.tsx further relies on Firebase SDK's auth state.

  if (!token) {
    // If no token, redirect to the homepage where users can select login
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If a token exists, let the request proceed.
  // Further role-based validation and actual token content verification
  // are handled client-side in DashboardLayout.tsx via Firebase SDK's auth state.
  // API routes should independently verify tokens using Firebase Admin SDK.
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/dashboard/:path*',
    '/student/dashboard/:path*',
    '/teacher/dashboard/:path*',
  ],
};

    