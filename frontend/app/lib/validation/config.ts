import { useValidationData } from '@/app/lib/api/validationApi';

export const SCHEMA_NAMES = {
  LOGIN_SCHEMA: 'LoginSchema',
  REGISTER_SCHEMA: 'RegisterSchema',
  RESET_PASSWORD_SCHEMA: 'ResetPasswordSchema',
  FORGOT_PASSWORD_EMAIL: 'ForgotPassowrdEmailSchema',
};

export const useSchema = (schemaName: string) => {
  const { data, isLoading } = useValidationData();

  if (isLoading) {
    return;
  }

  return data?.components?.schemas?.[schemaName];
};

/*
export const SCHEMA_NAMES = Object.fromEntries(
  Object.entries(preSchemaNamesMapping).map(([key, value]) => [key, `#/components/schemas/${value}`])
);

const parseOpenApiSpecData = (data) => {
  const definitions = data?.schemas?.definitions;

  if (!definitions) {
    return;
  }

  return Object.keys(definitions).reduce((mapping, schemaName) => {
    mapping[`#/schemas/definitions/${schemaName}`] = definitions[schemaName];
    return mapping;
  }, {});
};

const addAllSchemas = (ajv, mapping) => Object.entries(mapping).forEach((pair) => ajv.addSchema(pair[1], pair[0]));

const usePreparedAjv = () => {
  const ajv = new Ajv({
    allErrors: true,
    coerceTypes: true,
  });

  const { data, isLoading } = useValidationData();

  if (isLoading) {
    return;
  }

  const mapping = parseOpenApiSpecData(data);

  if (!mapping) {
    return;
  }

  AjvErrors(ajv);
  addFormats(ajv);
  addAllSchemas(ajv, mapping);

  return ajv;
};

export const usePreparedAjvSchemaName = (schemaName: string) => {
  const ajv = usePreparedAjv();

  if (!ajv) {
    return;
  }

  const schema = ajv.getSchema(schemaName);
  if (!schema) {
    throw new Error(`Schema "${schemaName}" not found`);
  }

  return schema;
};

export const useCustomAjvResolver = (schemaName: string) => {
  const validateFn = usePreparedAjvSchemaName(schemaName);

  if (!validateFn) {
    return (values) => ({ values, errors: {} });
  }

  return (values) => {
    const valid = validateFn(values);

    const result = valid
      ? { values, errors: {} }
      : {
          values,
          errors: validateFn.errors!.reduce((acc, error) => {
            const instancePath = error.instancePath.substring(1); // leading slash

            if (instancePath && error.schemaPath !== '#/errorMessage') {
              acc[getStringBeforeFirstSlash(instancePath)] = {
                message: error.message,
                ref: `name:${instancePath}`,
                field: getStringAfterLastSlash(instancePath),
                type: 'errorMessage',
              };
              return acc;
            }

            const nestedErrors = error.params?.errors;

            if (nestedErrors && nestedErrors.length > 0) {
              nestedErrors.forEach((nestedError) => {
                const missingProp = nestedError.params?.missingProperty;

                if (missingProp) {
                  acc[instancePath || missingProp] = {
                    message: error.message,
                    ref: `name:${missingProp}`,
                    field: missingProp,
                    type: 'errorMessage',
                  };
                }
              });
            }
            return acc;
          }, {}),
        };

    console.log('validation result: ', JSON.stringify(result));

    return result;
  };
};

const getStringAfterLastSlash = (string) => {
  const lastSlashIndex = string.lastIndexOf('/');
  return string.substring(lastSlashIndex + 1);
};

const getStringBeforeFirstSlash = (string) => string.split('/')[0];
 */

export const setFieldErrors =
  (setError: (arg0: string, arg1: { type: string; message: any }) => void) => (errorMessages: { [x: string]: any }) =>
    Object.keys(errorMessages).forEach((field) => {
      setError(field, {
        type: 'manual',
        message: errorMessages[field],
      });
    });
