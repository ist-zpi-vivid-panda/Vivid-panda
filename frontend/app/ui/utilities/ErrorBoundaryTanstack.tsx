'use client';

import { ChildrenProp } from '@/app/lib/definitions';
import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => {
  const { t } = useStrings(TranslationNamespace.Common);

  return (
    <div>
      <p>
        {t('something_went_wrong')}: {error.message}
      </p>
      <button onClick={resetErrorBoundary}>Retry</button>
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
