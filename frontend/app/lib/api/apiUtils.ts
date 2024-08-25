import API_CONFIG from '@/app/lib/api/config';
import { getQueryClient } from '@/app/lib/storage/getQueryClient';
import useUserData from '@/app/lib/storage/useUserData';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';

export const GET = 'GET';
export const PUT = 'PUT';
export const POST = 'POST';
export const DELETE = 'DELETE';

type HttpMethod = typeof GET | typeof PUT | typeof POST | typeof DELETE;

export const buildWholeApiUri = (endpoint: string) => `${API_CONFIG.root}${endpoint}`;
export const apiCallNoAutoConfig = async (method: HttpMethod, fullUri: string, token?: string, data?: never) => {
  const { logout } = useUserData.getState();

  const isFormData = data instanceof FormData;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : null),
  };

  const body = method !== GET && data ? (isFormData ? data : JSON.stringify(data)) : undefined;

  console.log(method, fullUri);

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
      logout();
    }
    throw new Error(responseText);
  }

  return await response.json();
};

export const apiCall = async (method: HttpMethod, resourcePath: string, data?: any) => {
  const { accessToken } = useUserData.getState();
  const fullUri = buildWholeApiUri(resourcePath);

  return apiCallNoAutoConfig(method, fullUri, accessToken, data);
};

export const getCall = async (requestUri: string) => apiCall(GET, requestUri);

export const postCall = async (requestUri: string, data: never) => apiCall(POST, requestUri, data);

export const deleteCall = async (requestUri: string) => apiCall(DELETE, requestUri);

export const putCall = async (requestUri: string, data: never) => apiCall(PUT, requestUri, data);

// onSuccess invalidates all queryKeys that start with value of queryKey (even ones with id)
export const useInvalidationMutation = (mutationFn, invalidationFn) =>
  useMutation({
    mutationFn,
    onSuccess: async () => invalidationFn(),
  });

export const useGetQuery = (queryKey: string[], requestUri: string) =>
  useSuspenseQuery({ queryKey: [...queryKey, requestUri], queryFn: () => getCall(requestUri) });

export const prefetchGetQuery = (queryKey: string[], requestUri: string) =>
  getQueryClient().prefetchQuery({ queryKey: [...queryKey, requestUri], queryFn: () => getCall(requestUri) });

export const usePostMutation = (invalidationFn, requestUri) =>
  useInvalidationMutation((data) => postCall(requestUri, data), invalidationFn);

export const useDeleteMutation = (invalidationFn, requestUriFn) =>
  useInvalidationMutation((data) => deleteCall(requestUriFn(data)), invalidationFn);

export const useUpdateMutation = (invalidationFn, requestUriFn) =>
  useInvalidationMutation(({ data, update }) => putCall(requestUriFn(data, update), data), invalidationFn);
