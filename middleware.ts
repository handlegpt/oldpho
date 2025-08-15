import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle uploads directory by redirecting to API route
  if (pathname.startsWith('/uploads/')) {
    // Redirect to our API route that can handle file serving
    const apiUrl = new URL('/api/static/uploads' + pathname.replace('/uploads', ''), request.url);
    return NextResponse.rewrite(apiUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/uploads/:path*',
};
