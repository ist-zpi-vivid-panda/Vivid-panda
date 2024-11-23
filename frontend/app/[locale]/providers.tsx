'use client';

import { ChildrenProp } from '@/app/lib/definitions';
import { ThemeProvider } from '@mui/material';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';

import { getQueryClient } from '../lib/storage/getQueryClient';
import theme from '../ui/themed/theme';
import { ActionPrompt } from '../ui/utilities/ActionPrompt';
import AuthRedirector from '../ui/utilities/AuthRedirector';
import ErrorBoundaryTanstack from '../ui/utilities/ErrorBoundaryTanstack';
import HydrationZustand from '../ui/utilities/HydrationZustand';

const Providers = ({ children }: ChildrenProp) => {
  const queryClient = getQueryClient();

  return (
    <ThemeProvider theme={theme}>
      <HydrationZustand>
        <AuthRedirector>
          <QueryClientProvider client={queryClient}>
            <ErrorBoundaryTanstack>
              <ReactQueryStreamedHydration>
                <ActionPrompt>
                  {children}

                  <ReactQueryDevtools initialIsOpen={false} />
                </ActionPrompt>
              </ReactQueryStreamedHydration>
            </ErrorBoundaryTanstack>
          </QueryClientProvider>
        </AuthRedirector>
      </HydrationZustand>
    </ThemeProvider>
  );
};
export default Providers;
