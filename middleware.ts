import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function redirectToSignin(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = '/admin/signin';
  return NextResponse.redirect(url);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Allow access to signin page and auth/logout APIs without authentication
  if (
    pathname === '/admin/signin' ||
    pathname === '/admin/api/auth' ||
    pathname === '/admin/api/logout'
  ) {
    return NextResponse.next();
  }

  // Check for cookie-based authentication first
  const authCookie = request.cookies.get('admin-auth');
  const header = request.headers.get('authorization') || '';
  const expectedUser = process.env.ADMIN_USER || 'admin';
  const expectedPass = process.env.ADMIN_PASS || 'password';

  // Check cookie authentication
  if (authCookie?.value) {
    try {
      const decoded = atob(authCookie.value);
      const [user, pass] = decoded.split(':');
      if (user === expectedUser && pass === expectedPass) {
        return NextResponse.next();
      }
    } catch {
      // Invalid cookie, continue to header check
    }
  }

  // Check header authentication (for API calls)
  if (header.startsWith('Basic ')) {
    try {
      const base64 = header.replace('Basic ', '');
      const decoded = atob(base64);
      const [user, pass] = decoded.split(':');

      if (user === expectedUser && pass === expectedPass) {
        return NextResponse.next();
      }
    } catch {
      // Invalid header
    }
  }

  return redirectToSignin(request);
}

export const config = {
  matcher: ['/admin/:path*'],
};
