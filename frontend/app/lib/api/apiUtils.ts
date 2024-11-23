/* eslint-disable @typescript-eslint/no-explicit-any */
import API_CONFIG from '@/app/lib/api/config';
import { getQueryClient } from '@/app/lib/storage/getQueryClient';
import useUserData from '@/app/lib/storage/useUserData';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { getI18n } from 'react-i18next';
import { toast } from 'react-toastify';

import { refreshToken } from './authApi';
import { DEFAULT_LOCALE } from '../internationalization/utils';

export type ErrorApiResponse = { error: string };

export type ValidationErrorsApiResponse = { validation_errors: Record<string, string[]> };

export type ApiResponse<T> = ErrorApiResponse | T;

export type ApiResponseWithValidationErrors<T> = ValidationErrorsApiResponse | ApiResponse<T>;

type UpdateData<T> = {
  id: string;
  data: T;
};

export type SuccessStatusResponse = { success: boolean };

export enum HttpMethod {
  GET = 'GET',
  PATCH = 'PATCH',
  POST = 'POST',
  DELETE = 'DELETE',
}

export const buildWholeApiUri = (endpoint: string) => `${API_CONFIG.root}${endpoint}`;

const buildHeaders = (isFormData: boolean, token?: string) => ({
  'Accept-Language': getI18n().language || DEFAULT_LOCALE,
  ...(!isFormData && { 'Content-Type': 'application/json' }),
  ...(token && { Authorization: `Bearer ${token}` }),
});

export const apiCallNoAutoConfig = async <T extends object>(
  method: HttpMethod,
  fullUri: string,
  token?: string,
  data?: any
) => {
  const { logout } = useUserData.getState();

  const isFormData = data instanceof FormData;

  const headers = buildHeaders(isFormData, token);

  const body = method !== HttpMethod.GET && data ? (isFormData ? data : JSON.stringify(data)) : undefined;

  console.log(method, fullUri, '\nHEADERS:', headers, '\nBODY:', body);

  const response = await fetch(fullUri, {
    method,
    headers,
    mode: 'cors',
    credentials: 'include',
    ...(body && { body }),
  });

  const contentType = response.headers.get('Content-Type');

  const responseBody: ApiResponseWithValidationErrors<T> =
    contentType === 'application/json' ? await response.json() : await response.blob();

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
        toast.error(`${error}: ${JSON.stringify(responseBody.validation_errors[error])}`);
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

export const getCall = async <T extends object>(requestUri: string) => apiCall<T>(HttpMethod.GET, requestUri);

export const postCall = async <T extends object>(requestUri: string, data: any) =>
  apiCall<T>(HttpMethod.POST, requestUri, data);

export const deleteCall = async <T extends object>(requestUri: string) => apiCall<T>(HttpMethod.DELETE, requestUri);

export const patchCall = async <T extends object>(requestUri: string, data: any) =>
  apiCall<T>(HttpMethod.PATCH, requestUri, data);

// onSuccess invalidates all queryKeys that start with value of queryKey (even ones with id)
export const useInvalidationMutation = <T, R extends object>(
  mutationFn: {
    (data: T): Promise<R>;
  },
  invalidationFn: () => void
) =>
  useMutation({
    mutationFn,
    onSuccess: async () => invalidationFn(),
  });

export const useGetQuery = <T extends object>(queryKey: string[], requestUri: string) =>
  useSuspenseQuery({ queryKey: [...queryKey, requestUri], queryFn: () => getCall<T>(requestUri) });

export const prefetchGetQuery = <T extends object>(queryKey: string[], requestUri: string) =>
  getQueryClient().prefetchQuery({ queryKey: [...queryKey, requestUri], queryFn: () => getCall<T>(requestUri) });

export const usePostMutation = <T, R extends object>(
  invalidationFn: () => void,
  requestUri: string,
  formatFn?: (_: T) => any
) => useInvalidationMutation<T, R>((data: T) => postCall<R>(requestUri, formatFn?.(data) ?? data), invalidationFn);

export const useDeleteMutation = <T, R extends object>(invalidationFn: () => void, requestUriFn: (_: T) => string) =>
  useInvalidationMutation<T, R>((data: T) => deleteCall<R>(requestUriFn(data)), invalidationFn);

export const useUpdateMutation = <T, R extends object>(
  invalidationFn: () => void,
  requestUriFn: (_: string) => string,
  formatFn?: (_: T) => any
) =>
  useInvalidationMutation<UpdateData<T>, R>(
    (data: UpdateData<T>) => patchCall<R>(requestUriFn(data.id), formatFn?.(data.data) ?? data.data),
    invalidationFn
  );
