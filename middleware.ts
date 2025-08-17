import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function unauthorizedResponse() {
  const res = new NextResponse('Authentication required', { status: 401 });
  res.headers.set('WWW-Authenticate', 'Basic realm="Admin"');
  return res;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const header = request.headers.get('authorization') || '';
  const expectedUser = process.env.ADMIN_USER || 'admin';
  const expectedPass = process.env.ADMIN_PASS || 'password';

  if (!header.startsWith('Basic ')) {
    return unauthorizedResponse();
  }

  try {
    const base64 = header.replace('Basic ', '');
    // Edge runtime: use atob instead of Buffer
    const decoded = atob(base64);
    const [user, pass] = decoded.split(':');

    if (user === expectedUser && pass === expectedPass) {
      return NextResponse.next();
    }
    return unauthorizedResponse();
  } catch {
    return unauthorizedResponse();
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
