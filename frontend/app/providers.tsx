'use client';

import { ChildrenProp } from '@/app/lib/definitions';
import { getQueryClient } from '@/app/lib/storage/getQueryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const Providers = ({ children }: ChildrenProp) => (
  <QueryClientProvider client={getQueryClient()}>
    {children}
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);

export default Providers;
