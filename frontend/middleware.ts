import i18nConfig from '@/i18nConfig';
import type { NextRequest } from 'next/server';
import { i18nRouter } from 'next-i18n-router';

export const middleware = (request: NextRequest) => {
  return i18nRouter(request, i18nConfig);
};

export const config = {
  matcher: '/((?!api|static|.*\\..*|_next).*)',
};
