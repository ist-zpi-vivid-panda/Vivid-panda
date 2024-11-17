'use client';

import { useState, useEffect } from 'react';

import { ChildrenProp } from '@/app/lib/definitions';
import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';
import { Card } from '@mui/material';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => {
  const { t } = useStrings(TranslationNamespace.Common);

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

  return (
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
            {t('something_went_wrong')}: {error.message}
          </p>
          <button className="text-large" style={{ color: 'black' }} onClick={resetErrorBoundary}>
            Retry
          </button>
        </div>
      </Card>
    </div>
  );
};

const ErrorBoundaryTanstack = ({ children }: ChildrenProp) => (
  <QueryErrorResetBoundary>
    {({ reset }) => (
      <ErrorBoundary onReset={reset} FallbackComponent={ErrorFallback}>
        {children}
      </ErrorBoundary>
    )}
  </QueryErrorResetBoundary>
);

export default ErrorBoundaryTanstack;
