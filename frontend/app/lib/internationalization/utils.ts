import { Metadata } from 'next';

import { LocaleParamProps, SupportedLocale, TranslationNamespace } from './definitions';
import initTranslations from './i18n';

export const DEFAULT_LOCALE = SupportedLocale.en as const;

export const generateMetadataFunctor =
  (titleName: string) =>
  async ({ params }: LocaleParamProps): Promise<Metadata> => {
    const { locale } = await params;

    const { t } = await initTranslations(locale, [TranslationNamespace.METADATA]);

    return {
      title: t(titleName),
    };
  };
