/* eslint-disable @typescript-eslint/no-explicit-any */
import API_CONFIG from '@/app/lib/api/config';
import { getQueryClient } from '@/app/lib/storage/getQueryClient';
import useUserData from '@/app/lib/storage/useUserData';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';

export type ApiResponse<T> = { error: string } | T;

export const GET = 'GET' as const;
export const PUT = 'PUT' as const;
export const POST = 'POST' as const;
export const DELETE = 'DELETE' as const;

type HttpMethod = typeof GET | typeof PUT | typeof POST | typeof DELETE;

export const buildWholeApiUri = (endpoint: string) => `${API_CONFIG.root}${endpoint}`;

export const apiCallNoAutoConfig = async <T>(
  method: HttpMethod,
  fullUri: string,
  token?: string,
  data?: any
): Promise<ApiResponse<T>> => {
  const { logout } = useUserData.getState();

  const isFormData = data instanceof FormData;

  const headers = {
    ...(!isFormData ? { 'Content-Type': 'application/json' } : null),
    ...(token ? { Authorization: `Bearer ${token}` } : null),
  };

  const body = method !== GET && data ? (isFormData ? data : JSON.stringify(data)) : undefined;

  console.log(method, fullUri, '\nHEADERS:', headers, '\nBODY:', body);

  const response = await fetch(fullUri, {
    method,
    headers,
    mode: 'cors',
    credentials: 'include',
    ...(body && { body }),
  });

  if (!response.ok) {
    console.warn('error on: ', method, fullUri);
    const responseText = await response.text();

    if (response.status === 403) {
      // shady actions!
      logout?.();
    }

    console.log('HEADERS:', headers, token);
    throw new Error(responseText);
  }

  const json = await response.json();

  console.log('RESPONSE:', json);

  return json;
};

export const apiCall = async <T>(method: HttpMethod, resourcePath: string, data?: any) => {
  const { accessToken } = useUserData.getState();
  const fullUri = buildWholeApiUri(resourcePath);

  return apiCallNoAutoConfig<T>(method, fullUri, accessToken, data);
};

export const getCall = async <T>(requestUri: string) => <T>apiCall(GET, requestUri);

export const postCall = async <T>(requestUri: string, data: any) => <T>apiCall(POST, requestUri, data);

export const deleteCall = async (requestUri: string) => apiCall(DELETE, requestUri);

export const putCall = async (requestUri: string, data: any) => apiCall(PUT, requestUri, data);

// onSuccess invalidates all queryKeys that start with value of queryKey (even ones with id)
export const useInvalidationMutation = (
  mutationFn: {
    (data: any): Promise<any>;
    (data: any): Promise<any>;
    (data: any): Promise<any>;
  },
  invalidationFn: () => unknown
) =>
  useMutation({
    mutationFn,
    onSuccess: async () => invalidationFn(),
  });

export const useGetQuery = <T>(queryKey: string[], requestUri: string) =>
  useSuspenseQuery({ queryKey: [...queryKey, requestUri], queryFn: () => <T>getCall(requestUri) });

export const prefetchGetQuery = <T>(queryKey: string[], requestUri: string) =>
  getQueryClient().prefetchQuery({ queryKey: [...queryKey, requestUri], queryFn: () => <T>getCall(requestUri) });

export const usePostMutation = <T>(invalidationFn: any, requestUri: string) =>
  useInvalidationMutation((data: T) => postCall(requestUri, data), invalidationFn);

export const useDeleteMutation = <T>(invalidationFn: any, requestUriFn: (_: T) => string) =>
  useInvalidationMutation((data: T) => deleteCall(requestUriFn(data)), invalidationFn);

export const useUpdateMutation = <T>(invalidationFn: any, requestUriFn: (_: T) => string) =>
  useInvalidationMutation((data: T) => putCall(requestUriFn(data), data), invalidationFn);
