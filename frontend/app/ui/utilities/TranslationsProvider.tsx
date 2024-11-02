'use client';

import initTranslations from '@/app/i18n';
import { Children } from '@/app/lib/definitions';
import { SupportedLocale, TranslationNamespace } from '@/app/lib/internationalization/definitions';
import { createInstance, Resource } from 'i18next';
import { I18nextProvider } from 'react-i18next';

type TranslationsProviderProps = {
  children?: Children;
  locale: SupportedLocale;
  namespaces: TranslationNamespace[];
  resources: Resource;
};

const TranslationsProvider = ({ children, locale, namespaces, resources }: TranslationsProviderProps) => {
  const i18n = createInstance();

  initTranslations(locale, namespaces, i18n, resources);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
};

export default TranslationsProvider;
