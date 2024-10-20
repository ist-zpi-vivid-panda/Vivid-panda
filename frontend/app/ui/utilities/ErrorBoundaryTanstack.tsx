import { ChildrenProp } from '@/app/lib/definitions';
import { Button } from '@mui/material';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div>
    <p>Something went wrong: {error.message}</p>
    <button onClick={resetErrorBoundary}>Retry</button>
  </div>
);

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
