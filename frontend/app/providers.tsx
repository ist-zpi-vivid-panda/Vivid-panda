'use client';

import { ChildrenProp } from '@/app/lib/definitions';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';
import { ToastContainer } from 'react-toastify';

import { getQueryClient } from './lib/storage/getQueryClient';
import AuthRedirector from './ui/utilities/AuthRedirector';
import ErrorBoundaryTanstack from './ui/utilities/ErrorBoundaryTanstack';
import HydrationZustand from './ui/utilities/HydrationZustand';

const Providers = ({ children }: ChildrenProp) => {
  const queryClient = getQueryClient();

  return (
    <HydrationZustand>
      <AuthRedirector>
        <QueryClientProvider client={queryClient}>
          <ErrorBoundaryTanstack>
            <ReactQueryStreamedHydration>
              <ToastContainer />

              {children}

              <ReactQueryDevtools initialIsOpen={false} />
            </ReactQueryStreamedHydration>
          </ErrorBoundaryTanstack>
        </QueryClientProvider>
      </AuthRedirector>
    </HydrationZustand>
  );
};
export default Providers;
