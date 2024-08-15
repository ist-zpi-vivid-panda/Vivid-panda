import { QueryClient } from '@tanstack/react-query';

const queryClient = new QueryClient();

export const getQueryClient = () => queryClient;

export const clearAllQueries = () => getQueryClient().clear();
