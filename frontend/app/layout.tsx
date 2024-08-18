import Providers from '@/app/providers';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const APP_TITLE = 'Vivid-Panda';

// ------------------ begin :: metadata ------------------
export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_TITLE}`,
    default: APP_TITLE,
  },
  description: 'Your universal image editing and drawing app!',
  keywords: ['drawing', 'image editing', 'editing', 'creation', 'creative', 'imagination'],
};

export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width',
};
// ------------------ end :: metadata ------------------

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => (
  <html lang="en">
    <body className={inter.className}>
      <Providers>{children}</Providers>
    </body>
  </html>
);

export default RootLayout;