export enum SupportedLocale {
  en = 'en',
  pl = 'pl',
}

export enum TranslationNamespace {
  COMMON = 'common',
  AUTH = 'auth',
  CANVAS = 'canvas',
  FILES = 'files',
  LICENSES = 'licenses',
  ERROR = 'error',
  FILTERS = 'filters',
  METADATA = 'metadata',
}

export type LocaleParam = Promise<{ locale: SupportedLocale }>;

export type LocaleParamProps = {
  params: LocaleParam;
};

export const DEFAULT_LOCALE = SupportedLocale.en as const;
