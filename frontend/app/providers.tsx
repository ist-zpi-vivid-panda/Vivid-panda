'use client';

import { ChildrenProp } from '@/app/lib/definitions';
import { getQueryClient } from '@/app/lib/storage/getQueryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';

import AuthRedirector from './ui/utilities/AuthRedirector';
import HydrationZustand from './ui/utilities/HydrationZustand';

const Providers = ({ children }: ChildrenProp) => (
  <QueryClientProvider client={getQueryClient()}>
    <ReactQueryStreamedHydration>
      <HydrationZustand>
        <AuthRedirector>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </AuthRedirector>
      </HydrationZustand>
    </ReactQueryStreamedHydration>
  </QueryClientProvider>
);

export default Providers;
