// /app/error.tsx
'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';
import { Card } from '@mui/material';
import { useRouter } from 'next/navigation';

interface ErrorPageProps {
  error: { statusCode?: number; message?: string };
  reset: () => void;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ reset }) => {
  const router = useRouter();
  const { t } = useStrings(TranslationNamespace.Error);

  const [backgroundSize, setBackgroundSize] = useState('20%');

  useEffect(() => {
    const updateBackgroundSize = () => {
      const width = window.innerWidth;

      if (width >= 1280) {
        setBackgroundSize('50%'); // Large screens
      } else if (width >= 1024) {
        setBackgroundSize('30%'); // Medium screens
      } else if (width >= 640) {
        setBackgroundSize('20%'); // Small screens
      } else {
        setBackgroundSize('12%'); // Default size for smaller screens
      }
    };
    updateBackgroundSize();
    window.addEventListener('resize', updateBackgroundSize);

    return () => window.removeEventListener('resize', updateBackgroundSize);
  }, []);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  return (
    // eslint-disable-next-line jsx-a11y/html-has-lang
    <html>
      <head>
        <title>{t('error')}</title>
      </head>
      <body>
        <div
          className="logoSadBackground min-h-screen bg-center"
          style={{
            backgroundPosition: 'center',
            backgroundSize: backgroundSize,
            width: '100%',
            height: '100vh',
          }}
        >
          <Card style={{ backgroundColor: 'pink', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '20px',
                alignItems: 'center',
              }}
            >
              <p className="text-large" style={{ color: 'black' }}>
                {t('error')}
              </p>
              <button className="text-large" style={{ color: 'black' }} onClick={handleBack}>
                {t('back')}
              </button>
            </div>
          </Card>
        </div>
      </body>
    </html>
  );
};
export default ErrorPage;
