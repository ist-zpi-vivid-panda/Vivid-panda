export enum SupportedLocale {
  en = 'en',
  pl = 'pl',
}

export enum TranslationNamespace {
  Common = 'common',
  Auth = 'auth',
}

export type LocaleParam = Promise<{ locale: SupportedLocale }>;

export type LocaleParamProps = {
  params: LocaleParam;
};
