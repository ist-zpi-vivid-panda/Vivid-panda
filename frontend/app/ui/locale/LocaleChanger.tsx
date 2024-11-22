'use client';

import { Dispatch, SetStateAction, useCallback, useMemo } from 'react';

import { SupportedLocale, TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';
import { getEnumValues } from '@/app/lib/utilities/enums';
import i18nConfig from '@/i18nConfig';
import { MenuItem } from '@mui/material';
import Menu from '@mui/material/Menu';
import dayjs from 'dayjs';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

type LocaleChangerProps = {
  anchorEl: HTMLElement | null;
  setAnchorEl: Dispatch<SetStateAction<HTMLElement | null>>;
};

type LocaleChangerItemProps = {
  locale: SupportedLocale;
  onClick: () => void;
};

const COOKIE_DAYS = 30 as const;

const createExpirationDateFori18nCookie = () => dayjs().add(COOKIE_DAYS, 'days').toDate();

const LocaleChangerItem = ({ locale, onClick }: LocaleChangerItemProps) => {
  const { t } = useStrings(TranslationNamespace.Common);

  return <MenuItem onClick={onClick}>{t(locale)}</MenuItem>;
};

const locales = getEnumValues(SupportedLocale);

const LocaleChanger = ({ anchorEl, setAnchorEl }: LocaleChangerProps) => {
  const router = useRouter();
  const currentPathname = usePathname();
  const { i18n } = useTranslation();

  const currentLocale = useMemo(() => i18n.language, [i18n.language]);

  const open = Boolean(anchorEl);

  const handleCloseMenu = useCallback(() => setAnchorEl(null), [setAnchorEl]);

  const handleChange = useCallback(
    (newLocale: SupportedLocale) => {
      // set cookie for next-i18n-router
      const expires = createExpirationDateFori18nCookie().toUTCString();
      document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`;

      // redirect to the new locale path
      if (currentLocale === i18nConfig.defaultLocale /* && !i18nConfig.prefixDefault */) {
        router.push('/' + newLocale + currentPathname);
      } else {
        router.push(currentPathname.replace(`/${currentLocale}/`, `/${newLocale}/`));
      }

      router.refresh();
    },
    [currentLocale, currentPathname, router]
  );

  return (
    <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
      {locales.map((locale) => (
        <LocaleChangerItem key={locale} locale={locale} onClick={() => handleChange(locale)} />
      ))}
    </Menu>
  );
};

export default LocaleChanger;
