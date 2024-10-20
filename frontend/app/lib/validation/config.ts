import { useValidationData } from '@/app/lib/api/validationApi';

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

export const useSchema = (schemaName: string) => {
  const { data, isLoading } = useValidationData();

  if (isLoading) {
    return;
  }

  return data?.components?.schemas?.[schemaName];
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
