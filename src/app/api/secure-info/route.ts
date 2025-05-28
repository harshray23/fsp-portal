
// Example of a protected API Route Handler using Next.js App Router
// This route simulates fetching secure information.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth'; // Using our mock verifyToken

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1]; // Expecting "Bearer <token>"

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
  }

  const user = verifyToken(token); // Our mock verification

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
  }

  // At this point, the user is "authenticated".
  // You can also check user.role here if needed for more granular access.
  // For example: if (user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  // Return some secure data
  const secureData = {
    message: `Hello ${user.name}, this is secure information for role: ${user.role}.`,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(secureData, { status: 200 });
}
