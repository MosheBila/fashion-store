import { NextRequest, NextResponse } from 'next/server';
import { extractToken, verifyToken } from '@/lib/auth';

/**
 * POST /api/auth/verify
 * Verify JWT token validity
 *
 * Headers: Authorization: Bearer <token>
 * Response: { valid: boolean, user?: { id, email, role } }
 */
export async function POST(request: NextRequest) {
  try {
    const token = extractToken(request);

    if (!token) {
      return NextResponse.json(
        { valid: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { valid: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      valid: true,
      user: payload,
    });
  } catch (error) {
    console.error('Verify error:', error);

    return NextResponse.json(
      { valid: false, error: 'Token verification failed' },
      { status: 401 }
    );
  }
}
