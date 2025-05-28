
// Example of a protected API Route Handler using Next.js App Router
// This route simulates fetching secure information and now includes role-based access.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth'; // Using our mock verifyToken

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1]; // Expecting "Bearer <token>"

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }

    // In a REAL backend, verifyToken would use Firebase Admin SDK to verify the Firebase ID Token.
    // This mock function simulates that.
    const user = verifyToken(token); 

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    // Role-based access control: Only allow admins to access this route
    // In a real app, user.role would come from verified Firebase Custom Claims.
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions. Admin role required.' }, { status: 403 });
    }

    // At this point, the user is "authenticated" and has the correct role.
    // Return some secure data
    const secureData = {
      message: `Hello ${user.name}, this is secure information for role: ${user.role}. You have admin access.`,
      timestamp: new Date().toISOString(),
      adminSpecificData: "This data is only visible to admins.",
    };

    return NextResponse.json(secureData, { status: 200 });

  } catch (error) {
    console.error("API Error in /api/secure-info:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
