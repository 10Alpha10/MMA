import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth-token')?.value

  console.log(`Request to: ${pathname}`); // سجل المسار الذي يتم الوصول إليه

  const publicPaths = ['/login', '/signup', '/']

  if (token && publicPaths.includes(pathname)) {
    console.log('User is authenticated, redirecting to /generate'); // سجل إذا كان المستخدم مسجل الدخول
    if (pathname === '/') return NextResponse.next()
    return NextResponse.redirect(new URL('/generate', request.url))
  }

  if (!token && !publicPaths.includes(pathname)) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    console.log(`User is not authenticated, redirecting to login: ${loginUrl}`); // سجل إذا كان المستخدم غير مسجل الدخول
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
}
