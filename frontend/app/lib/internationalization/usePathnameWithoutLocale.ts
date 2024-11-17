import { usePathname } from 'next/navigation';

import { SupportedLocale } from './definitions';
import { getEnumValues } from '../utilities/enums';

const locales = getEnumValues(SupportedLocale);

const usePathnameWithoutLocale = () => {
  const pathname = usePathname();

  const usedLocale = locales.find((locale) => pathname.startsWith(`/${locale}/`));

  if (usedLocale) {
    return pathname.replace(`/${usedLocale}/`, '/');
  }

  const usedLocaleNoOtherParts = locales.find((locale) => pathname === `/${locale}`);

  if (usedLocaleNoOtherParts) {
    return '/';
  }

  return pathname;
};

export default usePathnameWithoutLocale;
