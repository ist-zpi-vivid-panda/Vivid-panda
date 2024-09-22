/* eslint-disable @typescript-eslint/no-explicit-any */
import API_CONFIG from '@/app/lib/api/config';
import { getQueryClient } from '@/app/lib/storage/getQueryClient';
import useUserData from '@/app/lib/storage/useUserData';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export type ErrorApiResponse = { error: string };

export type ValidationErrorsApiResponse = { validation_errors: Record<string, string[]> };

export type ApiResponse<T> = ErrorApiResponse | T;

export type ApiResponseWithValidationErrors<T> = ValidationErrorsApiResponse | ApiResponse<T>;

export const GET = 'GET' as const;
export const PUT = 'PUT' as const;
export const POST = 'POST' as const;
export const DELETE = 'DELETE' as const;

type HttpMethod = typeof GET | typeof PUT | typeof POST | typeof DELETE;

export const buildWholeApiUri = (endpoint: string) => `${API_CONFIG.root}${endpoint}`;

export const apiCallNoAutoConfig = async <T extends object>(
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

  const responseBody: ApiResponseWithValidationErrors<T> = await response.json();

  if (!response.ok) {
    console.warn('error on: ', method, fullUri);

    if (response.status === 403) {
      // shady actions!
      logout?.();
    }

    if ('validation_errors' in responseBody) {
      for (const error in responseBody.validation_errors) {
        toast.error(`${error}: ${responseBody.validation_errors[error]}`);
      }

      throw new Error(JSON.stringify(responseBody.validation_errors));
    }

    if ('error' in responseBody) {
      throw new Error(responseBody.error);
    }
  }

  // checked for validation so casting to ApiResponse<T> is OK
  return responseBody as T;
};

export const apiCall = async <T extends object>(method: HttpMethod, resourcePath: string, data?: any) => {
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

export const usePostMutation = <T>(invalidationFn: () => unknown, requestUri: string) =>
  useInvalidationMutation((data: T) => postCall(requestUri, data), invalidationFn);

export const useDeleteMutation = <T>(invalidationFn: () => unknown, requestUriFn: (_: T) => string) =>
  useInvalidationMutation((data: T) => deleteCall(requestUriFn(data)), invalidationFn);

export const useUpdateMutation = <T>(invalidationFn: () => unknown, requestUriFn: (_: T) => string) =>
  useInvalidationMutation((data: T) => putCall(requestUriFn(data), data), invalidationFn);
