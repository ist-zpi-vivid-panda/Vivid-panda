import * as Ajv from 'ajv';

import { prefetchGetQuery, useGetQuery } from './apiUtils';

type ValidationSchema = {
  components: {
    schemas: Record<string, Ajv.JSONSchemaType<unknown>>;
  };
};

const VALIDATION_QUERY_KEY = 'validation-qk' as const;

const VALIDATION_ENDPOINT = '/swagger' as const;

export const useValidationData = (locale: string) =>
  useGetQuery<ValidationSchema>([VALIDATION_QUERY_KEY, locale], VALIDATION_ENDPOINT);

export const prefetchValidation = () => prefetchGetQuery([VALIDATION_QUERY_KEY], VALIDATION_ENDPOINT);
