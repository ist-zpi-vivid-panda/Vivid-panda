import * as Ajv from 'ajv';

import { prefetchGetQuery, useGetQuery } from './apiUtils';

type ValidationSchema = {
  components: {
    schemas: Record<string, Ajv.JSONSchemaType<unknown>>;
  };
};

const VALIDATION_QUERY_KEY = 'validation-qk' as const;

const VALIDATION_ENDPOINT = '/validation' as const;

export const useValidationData = () => useGetQuery<ValidationSchema>([VALIDATION_QUERY_KEY], VALIDATION_ENDPOINT);

export const prefetchValidation = () => prefetchGetQuery([VALIDATION_QUERY_KEY], VALIDATION_ENDPOINT);
