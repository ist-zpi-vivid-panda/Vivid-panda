export enum SupportedLocale {
  en = 'en',
  pl = 'pl',
}

export enum TranslationNamespace {
  Common = 'common',
  Auth = 'auth',
  Canvas = 'canvas',
  Files = 'files',
  Licenses = 'licenses',
}

export type LocaleParam = Promise<{ locale: SupportedLocale }>;

export type LocaleParamProps = {
  params: LocaleParam;
};
