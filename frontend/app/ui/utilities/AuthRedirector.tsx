'use client';

import { useEffect, useMemo } from 'react';

import { ChildrenProp } from '@/app/lib/definitions';
import useUserData from '@/app/lib/storage/useUserData';
import { usePathname, redirect } from 'next/navigation';

const PREAUTH_ALLOWED_PATH_PARTS = ['/auth'] as const;
const PREAUTH_ALLOWED_PATHS = ['/' /* dashboard */];

const AuthRedirector = ({ children }: ChildrenProp) => {
  const pathname = usePathname();
  const { accessToken } = useUserData();

  const isPreAuthPath = useMemo(
    () =>
      PREAUTH_ALLOWED_PATHS.includes(pathname) || PREAUTH_ALLOWED_PATH_PARTS.some((part) => pathname.includes(part)),
    [pathname]
  );

  useEffect(() => {
    if (!accessToken && !isPreAuthPath) {
      redirect('/auth/login');
    }

    if (accessToken && isPreAuthPath) {
      redirect('/canvas/new');
    }
  }, [accessToken, isPreAuthPath, pathname]);

  return <>{children}</>;
};

export default AuthRedirector;
