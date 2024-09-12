import { useEffect, useMemo } from 'react';

import useUserData from '@/app/lib/storage/useUserData';
import { usePathname, useRouter } from 'next/navigation';

const PREAUTH_ALLOWED_PATH_PARTS = ['/auth'];
const PREAUTH_ALLOWED_PATHS = ['/' /* dashboard */];

const useAuthRedirector = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { accessToken } = useUserData();

  const isPreAuthPath = useMemo(
    () =>
      PREAUTH_ALLOWED_PATHS.includes(pathname) || PREAUTH_ALLOWED_PATH_PARTS.some((part) => pathname.includes(part)),
    [pathname]
  );

  useEffect(() => {
    if (!accessToken && !isPreAuthPath) {
      router.push('/auth/login');
      return;
    }

    if (accessToken && isPreAuthPath) {
      router.push('/canvas');
    }
  }, [accessToken, isPreAuthPath, router]);
};

export default useAuthRedirector;
