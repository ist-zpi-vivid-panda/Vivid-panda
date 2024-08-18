import { QueryClient } from '@tanstack/react-query';

const STALE_TIME = 1000 * 60 * 15; // 15 minutes

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME,
    },
  },
});

export const getQueryClient = () => queryClient;

export const clearAllQueries = () => getQueryClient().clear();
