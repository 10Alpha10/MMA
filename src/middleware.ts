// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth-token')?.value

  const publicPaths = ['/login', '/signup', '/']

  if (token && publicPaths.includes(pathname)) {
    if (pathname === '/') return NextResponse.next()
    return NextResponse.redirect(new URL('/generate', request.url))
  }

  if (!token && !publicPaths.includes(pathname)) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
}
