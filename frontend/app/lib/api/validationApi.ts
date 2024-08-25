import { prefetchGetQuery, useGetQuery } from '@/app/lib/api/apiUtils';

const VALIDATION_QUERY_KEY = 'validation-qk';

export const useValidationData = () => useGetQuery([VALIDATION_QUERY_KEY], '/validation/');

export const prefetchValidation = () => prefetchGetQuery([VALIDATION_QUERY_KEY], '/validation/');
