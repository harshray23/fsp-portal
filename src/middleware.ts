
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // The token is expected to be in a cookie named 'authToken'
  // This cookie is set client-side by src/lib/auth.ts upon Firebase login
  // and contains the Firebase ID Token (a signed JWT).
  const token = request.cookies.get('authToken')?.value;

  // PRODUCTION SECURITY NOTE:
  // The presence of the 'authToken' cookie (containing Firebase ID Token) is checked here.
  // However, for true security, this token MUST be cryptographically verified on the server-side.
  // This typically involves:
  // 1. Using Firebase Admin SDK in a backend environment (e.g., a Next.js API route or a dedicated backend).
  // 2. The backend would verify the ID token using `admin.auth().verifyIdToken(token)`.
  // 3. Alternatively, for server-managed sessions, the backend would create an HttpOnly session cookie
  //    using `admin.auth().createSessionCookie()` after initial Firebase login, and then this
  //    middleware (or an API route it calls) would verify that session cookie using
  //    `admin.auth().verifySessionCookie(sessionCookie, true)`.
  //
  // This current middleware only checks for the token's existence for prototype route protection.
  // It does NOT perform cryptographic validation of the token's signature or expiry.
  // Full token validation should occur in API routes or server-side logic before granting access
  // to sensitive operations or data. Client-side logic in DashboardLayout.tsx also relies
  // on Firebase SDK's auth state for UI rendering and role checks.

  if (!token) {
    // If no token, redirect to the homepage where users can select login
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If a token exists, let the request proceed.
  // Deeper validation (signature, expiry, roles) should be handled by:
  // 1. Client-side logic in DashboardLayout.tsx (already in place for UI).
  // 2. Server-side logic in API routes using Firebase Admin SDK (crucial for data operations).
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/dashboard/:path*',
    '/student/dashboard/:path*',
    '/teacher/dashboard/:path*',
  ],
};
    
