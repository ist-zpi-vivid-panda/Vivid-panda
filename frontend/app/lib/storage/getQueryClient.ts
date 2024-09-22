import { isServer, QueryClient, defaultShouldDehydrateQuery } from '@tanstack/react-query';

const STALE_TIME = 1000 * 60 * 60 * 2; // 2 hours

const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: STALE_TIME,
        retry: 3,
      },
      dehydrate: {
        // include pending queries in dehydration
        shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
    },
  });

let browserQueryClient: QueryClient | undefined = undefined;

export const getQueryClient = () => {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) {
      browserQueryClient = makeQueryClient();
    }

    return browserQueryClient;
  }
};

export const clearAllQueries = () => getQueryClient().clear();
export const invalidateAllQueries = async () => getQueryClient().invalidateQueries();
export const removeAllQueries = () => getQueryClient().removeQueries();

export const invalidate = async (queryKey: string[]) => getQueryClient().invalidateQueries({ queryKey });
