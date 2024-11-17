import 'react-toastify/dist/ReactToastify.css';
import 'cropperjs/dist/cropper.css';
import './globals.css';

import Providers from '@/app/[locale]/providers';
import FONT from '@/constants/Font';
import SEO_KEYWORDS from '@/constants/SEOKeywords';
import type { Metadata, Viewport } from 'next';
import { ToastContainer } from 'react-toastify';

import { Children } from '../lib/definitions';
import { LocaleParamProps, TranslationNamespace } from '../lib/internationalization/definitions';
import initTranslations from '../lib/internationalization/i18n';
import { getEnumValues } from '../lib/utilities/enums';
import TranslationsProvider from '../ui/utilities/TranslationsProvider';

type RootLayoutProps = Readonly<{
  children: Children;
}> &
  LocaleParamProps;

const APP_TITLE = 'Vivid-Panda' as const;

const APP_DESCRIPTION = 'Your universal image editing app!' as const;

// ------------------ begin :: metadata ------------------
export const metadata: Metadata = Object.freeze({
  title: {
    template: `%s | ${APP_TITLE}`,
    default: APP_TITLE,
  },
  description: APP_DESCRIPTION,
  keywords: SEO_KEYWORDS,
} as const);

export const viewport: Viewport = Object.freeze({
  initialScale: 1,
  width: 'device-width',
} as const);
// ------------------ end :: metadata ------------------

const namespaces = getEnumValues(TranslationNamespace);

const RootLayout = async ({ children, params }: RootLayoutProps) => {
  const { locale } = await params;

  const { resources } = await initTranslations(locale, namespaces);

  return (
    <html lang="en">
      <body className={FONT.className}>
        <TranslationsProvider locale={locale} namespaces={namespaces} resources={resources}>
          <Providers>
            <ToastContainer />

            {children}
          </Providers>
        </TranslationsProvider>
      </body>
    </html>
  );
};

export default RootLayout;
