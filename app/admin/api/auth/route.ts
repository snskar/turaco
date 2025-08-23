import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const token = (await cookies()).get('admin-auth')?.value;
    if (token) {
      return NextResponse.json({ success: true, message: 'Authenticated' });
    }
    return NextResponse.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: 'Authentication check failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const expectedUser = process.env.ADMIN_USER || 'admin';
    const expectedPass = process.env.ADMIN_PASS || 'password';

    console.log('Auth attempt:', {
      username,
      expectedUser,
      passwordMatch: password === expectedPass,
    });

    if (username === expectedUser && password === expectedPass) {
      // Create a token (just base64 encode the credentials for now)
      const token = Buffer.from(`${username}:${password}`).toString('base64');

      const response = NextResponse.json({
        success: true,
        token,
        message: 'Authentication successful',
      });

      // Set HTTP-only cookie for server-side middleware
      response.cookies.set('admin-auth', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/admin',
      });

      return response;
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth API error:', error);
    return NextResponse.json(
      { success: false, message: 'Authentication failed' },
      { status: 500 }
    );
  }
}
