/* eslint-disable @typescript-eslint/no-explicit-any */
import API_CONFIG from '@/app/lib/api/config';
import { getQueryClient } from '@/app/lib/storage/getQueryClient';
import useUserData from '@/app/lib/storage/useUserData';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export type ErrorApiResponse = { error: string };

export type ApiResponse<T> = ErrorApiResponse | T;

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

  const responseBody = await response.json();

  if (!response.ok) {
    console.warn('error on: ', method, fullUri);
    const projectedResponse = responseBody as ErrorApiResponse;

    if (response.status === 403) {
      // shady actions!
      logout?.();
    }

    toast.error(projectedResponse.error);
  }

  console.log('RESPONSE:', responseBody);

  return responseBody;
};

export const apiCall = async <T>(method: HttpMethod, resourcePath: string, data?: any) => {
  const { accessToken } = useUserData.getState();
  const fullUri = buildWholeApiUri(resourcePath);

  return apiCallNoAutoConfig<T>(method, fullUri, accessToken, data);
};

export const getCall = async <T>(requestUri: string) => <T>apiCall(GET, requestUri);

export const postCall = async (requestUri: string, data: any) => apiCall(POST, requestUri, data);

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
