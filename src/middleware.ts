import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin/login')) {
    return NextResponse.next();
  }

  const token = request.cookies.get('admin-auth-token')?.value;
  const loginUrl = new URL('/admin/login', request.url);

  if (!token) {
    return NextResponse.redirect(loginUrl);
  }
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is not set.');
    }
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    await jose.jwtVerify(token, secret);
    return NextResponse.next();

  } catch (error) {
    console.error('JWT Verification Error:', error);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.set('admin-auth-token', '', { maxAge: 0 });
    return response;
  }
}

// --- Middleware Config ---
export const config = {
  matcher: '/admin/:path*',
};
