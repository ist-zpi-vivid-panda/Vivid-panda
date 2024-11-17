import { useMemo } from 'react';

import { useValidationData } from '@/app/lib/api/validationApi';
import { JSONSchemaType } from 'ajv';
import { useTranslation } from 'react-i18next';

import { SupportedLocale } from '../internationalization/definitions';

export enum SchemaNames {
  // auth
  LoginSchema = 'Login',
  RegisterSchema = 'Register',
  SendEmailRequestSchema = 'SendEmailRequest',
  ResetPasswordSchema = 'ResetPassword',

  // files
  FileInfoEditSchema = 'FileInfoEdit',
  FileDataSchema = 'FileData',
}

type FieldProps = {
  type?: string;
  errorMessage?: Record<string, never>;
  [key: string]: unknown;
};

const enhanceSchemaWithErrorMessages = (
  schema: JSONSchemaType<unknown>,
  locale: SupportedLocale
): JSONSchemaType<unknown> => {
  if (!schema.properties) {
    return schema;
  }

  for (const [, fieldProps] of Object.entries(schema.properties)) {
    const field = fieldProps as FieldProps;

    if (field.errorMessage && field.errorMessage?.[locale]) {
      field.errorMessage = field.errorMessage[locale];
    }
  }

  console.log(schema);

  return schema;
};

export const useSchema = (schemaName: string) => {
  const { data, isLoading } = useValidationData();
  const { i18n } = useTranslation();

  const schema = useMemo(() => data?.components?.schemas?.[schemaName], [data?.components?.schemas, schemaName]);
  const currentLocale = useMemo(() => i18n.language as SupportedLocale, [i18n.language]);

  if (!schema || !isLoading) {
    return;
  }

  return enhanceSchemaWithErrorMessages(schema, currentLocale);
};

export const setFieldErrors =
  (setError: (arg0: string, arg1: { type: string; message: string }) => void) =>
  (errorMessages: { [x: string]: string }) =>
    Object.keys(errorMessages).forEach((field) => {
      setError(field, {
        type: 'manual',
        message: errorMessages[field],
      });
    });
