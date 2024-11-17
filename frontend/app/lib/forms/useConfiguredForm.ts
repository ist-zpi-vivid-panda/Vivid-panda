import { SchemaNames, useSchema } from '@/app/lib/validation/config';
import { ajvResolver } from '@hookform/resolvers/ajv';
import { fullFormats } from 'ajv-formats/dist/formats';
import { FieldPath, FieldPathValue, FieldValues, SetValueConfig, useForm, UseFormProps } from 'react-hook-form';

const useConfiguredForm = ({ schemaName, ...restOfProps }: UseFormProps & { schemaName?: SchemaNames }) => {
  const schema = useSchema(schemaName ?? '');

  const formHook = useForm({
    ...restOfProps,
    mode: 'onChange',
    ...(schema && {
      resolver: ajvResolver(schema, {
        formats: fullFormats,
      }),
    }),
  });

  const setValueWithValidation = (
    name: FieldPath<FieldValues>,
    value: FieldPathValue<FieldValues, FieldPath<FieldValues>>,
    options: SetValueConfig = {}
  ) => formHook.setValue(name, value, { shouldValidate: true, ...options });

  return {
    ...formHook,
    setValue: setValueWithValidation, // this may cause the validation to run when loading a form but that's not really a concern
  };
};

export default useConfiguredForm;
