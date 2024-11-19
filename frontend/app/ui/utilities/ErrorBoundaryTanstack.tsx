import { ChildrenProp } from '@/app/lib/definitions';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

import ErrorFallback from '../errors/ErrorFallback';

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
