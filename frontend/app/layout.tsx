import 'react-toastify/dist/ReactToastify.css';
import 'cropperjs/dist/cropper.css';
import './globals.css';

import Providers from '@/app/providers';
import FONT from '@/constants/Font';
import SEO_KEYWORDS from '@/constants/SEOKeywords';
import type { Metadata, Viewport } from 'next';
import { ToastContainer } from 'react-toastify';

import { Children } from './lib/definitions';

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

const RootLayout = ({
  children,
}: Readonly<{
  children: Children;
}>) => (
  <html lang="en">
    <body className={FONT.className}>
      <Providers>
        <ToastContainer />

        {children}
      </Providers>
    </body>
  </html>
);

export default RootLayout;
