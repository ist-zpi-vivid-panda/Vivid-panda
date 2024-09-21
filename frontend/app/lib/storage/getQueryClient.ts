import { isServer, QueryClient, defaultShouldDehydrateQuery } from '@tanstack/react-query';

const STALE_TIME = 1000 * 60 * 15; // 15 minutes

const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: STALE_TIME,
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

export const invalidate = async (queryKey: string[]) => getQueryClient().invalidateQueries({ queryKey });

export const invalidateAllQueries = async () => getQueryClient().invalidateQueries();
