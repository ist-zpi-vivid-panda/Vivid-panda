import { NextResponse } from 'next/server';

const notworkingMiddleware = (req) => {
  console.log('MIDDLEWARE')
  const { pathname } = req.nextUrl;

  const isAuthRoute = pathname.startsWith('/auth');
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const authHeader = req.headers.get('authorization');

  console.log('RES', isAuthRoute, authHeader)

  if (!authHeader) {
    console.log(0)
    if (!isAuthRoute && !isDashboardRoute) {

      console.log(1)
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  } else {
    console.log(2)

    if (isAuthRoute) {
      console.log(3)

      return NextResponse.redirect(new URL('/canvas', req.url));
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};

export default notworkingMiddleware;
