/* eslint-disable @typescript-eslint/no-explicit-any */
import API_CONFIG from '@/app/lib/api/config';
import { getQueryClient } from '@/app/lib/storage/getQueryClient';
import useUserData from '@/app/lib/storage/useUserData';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { refreshToken } from './authApi';

export type ErrorApiResponse = { error: string };

export type ValidationErrorsApiResponse = { validation_errors: Record<string, string[]> };

export type ApiResponse<T> = ErrorApiResponse | T;

export type ApiResponseWithValidationErrors<T> = ValidationErrorsApiResponse | ApiResponse<T>;

type UpdateData<T> = {
  id: string;
  data: T;
};

export const GET = 'GET' as const;
export const PATCH = 'PATCH' as const;
export const POST = 'POST' as const;
export const DELETE = 'DELETE' as const;

type HttpMethod = typeof GET | typeof PATCH | typeof POST | typeof DELETE;

export const buildWholeApiUri = (endpoint: string) => `${API_CONFIG.root}${endpoint}`;

export const apiCallNoAutoConfig = async <T extends object>(
  method: HttpMethod,
  fullUri: string,
  token?: string,
  data?: any
) => {
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

    if (response.status === 401) {
      if (
        'error' in responseBody &&
        responseBody.error === 'The access token has expired' /* TODO: change this to an error code! */
      ) {
        refreshToken();

        toast.error(responseBody.error);
      } else {
        // shady actions!
        logout?.();
      }
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

  console.log('BODY:', responseBody);

  // checked for validation so casting to ApiResponse<T> is OK
  return responseBody as T;
};

export const apiCallNoAutoToken = async <T extends object>(
  method: HttpMethod,
  resourcePath: string,
  token?: string,
  data?: any
) => {
  const fullUri = buildWholeApiUri(resourcePath);

  return apiCallNoAutoConfig<T>(method, fullUri, token, data);
};

export const apiCall = async <T extends object>(method: HttpMethod, resourcePath: string, data?: any) => {
  const { accessToken } = useUserData.getState();

  return apiCallNoAutoToken<T>(method, resourcePath, accessToken, data);
};

export const getCall = async <T>(requestUri: string) => <T>apiCall(GET, requestUri);

export const postCall = async <T>(requestUri: string, data: any) => <T>apiCall(POST, requestUri, data);

export const deleteCall = async (requestUri: string) => apiCall(DELETE, requestUri);

export const patchCall = async (requestUri: string, data: any) => apiCall(PATCH, requestUri, data);

// onSuccess invalidates all queryKeys that start with value of queryKey (even ones with id)
export const useInvalidationMutation = <T>(
  mutationFn: {
    (data: T): Promise<any>;
  },
  invalidationFn: () => void
) =>
  useMutation({
    mutationFn,
    onSuccess: async () => invalidationFn(),
  });

export const useGetQuery = <T>(queryKey: string[], requestUri: string) =>
  useSuspenseQuery({ queryKey: [...queryKey, requestUri], queryFn: () => <T>getCall(requestUri) });

export const prefetchGetQuery = <T>(queryKey: string[], requestUri: string) =>
  getQueryClient().prefetchQuery({ queryKey: [...queryKey, requestUri], queryFn: () => <T>getCall(requestUri) });

export const usePostMutation = <T>(invalidationFn: () => void, requestUri: string) =>
  useInvalidationMutation<T>((data: T) => postCall(requestUri, data), invalidationFn);

export const useDeleteMutation = <T>(invalidationFn: () => void, requestUriFn: (_: T) => string) =>
  useInvalidationMutation<T>((data: T) => deleteCall(requestUriFn(data)), invalidationFn);

export const useUpdateMutation = <T>(invalidationFn: () => void, requestUriFn: (_: string) => string) =>
  useInvalidationMutation<UpdateData<T>>(
    (data: UpdateData<T>) => patchCall(requestUriFn(data.id), data.data),
    invalidationFn
  );
