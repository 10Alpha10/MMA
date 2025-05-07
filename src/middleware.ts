import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('auth-token')?.value

  // الصفحات العامة التي لا تتطلب مصادقة
  const publicPaths = ['/login', '/signup', '/']
  
  // 1. إذا كان المستخدم مسجل دخول وحاول الوصول لصفحات عامة
  if (token && publicPaths.includes(pathname)) {
    // تجاهل الصفحة الرئيسية (/)
    if (pathname === '/') {
      return NextResponse.next()
    }
    // توجيه إلى /generate عند محاولة الوصول لـ /login أو /signup
    return NextResponse.redirect(new URL('/generate', request.url))
  }

  // 2. إذا كان المستخدم غير مسجل دخول وحاول الوصول لصفحة محمية
  if (!token && !publicPaths.includes(pathname)) {
    // حفظ الصفحة المطلوبة قبل إعادة التوجيه للعودة إليها لاحقاً
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // 3. السماح بالوصول للصفحات العامة أو الصفحات المحمية للمستخدمين المسجلين
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
}