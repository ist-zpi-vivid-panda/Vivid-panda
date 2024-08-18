import { FieldPath, FieldPathValue, FieldValues, SetValueConfig, useForm, UseFormProps } from 'react-hook-form';

export const useConfiguredForm = (props?: UseFormProps) => {
  const formHook = useForm({
    ...props,
    mode: 'onChange',
    // resolver: customAjvResolver(schemaName),
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
