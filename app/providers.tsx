'use client';

import { getQueryClient } from '@/storage/queryClientConfig';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const Providers = ({ children }) => (
  <QueryClientProvider client={getQueryClient()} contextSharing>
    {children}
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

export default Providers;
