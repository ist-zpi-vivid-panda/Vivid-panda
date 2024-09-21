import {
  FocusEvent,
  FocusEventHandler,
  forwardRef,
  InputHTMLAttributes,
  ReactElement,
  useCallback,
  useMemo,
  useState,
} from 'react';

import { Control, Controller, FieldErrors } from 'react-hook-form';
import { FaAsterisk, FaEyeSlash, FaEye } from 'react-icons/fa6';

import ErrorField from './ErrorField';

type CustomInputProps = {
  label?: string;
  placeholder?: string;
  onChange?: (value: HTMLInputElement) => void;
  onBlur?: () => void;
  value?: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  rightIcon?: ReactElement;
} & InputHTMLAttributes<HTMLInputElement>;

type ControlledCustomInputProps = {
  control: Control;
  name: string;
  errors: FieldErrors;
  label: string;
  formatFn?: (value: unknown) => string;
} & CustomInputProps;

const CustomInput = forwardRef(
  (
    {
      label,
      placeholder,
      onChange,
      onBlur = () => {},
      value,
      required = false,
      error,
      disabled = false,
      rightIcon,
      ...restOfProps
    }: CustomInputProps,
    ref
  ) => {
    const [isFocused, setIsFocused] = useState<boolean>(false);

    const handleInputFocus = useCallback(() => setIsFocused(true), []);

    const handleInputBlur = useCallback(
      (
        blurCallback: (() => void) & FocusEventHandler<HTMLInputElement>,
        formData: FocusEvent<HTMLInputElement, Element>
      ) => {
        try {
          setIsFocused(false);
          blurCallback(formData);
        } catch {
          /* empty */
        }
      },
      []
    );

    const isEmpty = useMemo(() => !value || value.length <= 0, [value]);
    const requiredAsterisk = useMemo(() => required && <FaAsterisk size={6} className="danger" />, [required]);

    return (
      <div className="flex flex-col gap-2">
        <div
          className={`${disabled && 'disabled'} ${isFocused && 'primaryBorder'} ${error && 'dangerBorder'} border-gray-500 textBackground overflow-hidden rounded-md p-2`}
        >
          <div className="flex flex-row">
            <div className="flex-1 justify-center">
              {!isEmpty && label && (
                <div className="flex flex-1 flex-row gap-1">
                  <span className="text-xs">{label}</span>
                  {requiredAsterisk}
                </div>
              )}

              <div className={`${isEmpty && 'py-2'} flex flex-row items-center relative`}>
                {isEmpty && (
                  <div className="pointer-events-none absolute gap-1 flex flex-row">
                    <span>{placeholder || label}</span>
                    {requiredAsterisk}
                  </div>
                )}

                <input
                  {...restOfProps}
                  className="flex flex-1 rounded-md bg-transparent"
                  onFocus={handleInputFocus}
                  onBlur={(formData) => handleInputBlur(onBlur, formData)}
                  onChange={onChange}
                  value={value || ''}
                  ref={ref as React.RefObject<HTMLInputElement>}
                />
              </div>
            </div>

            {rightIcon && <div className="my-auto">{rightIcon}</div>}
          </div>
        </div>

        <ErrorField error={error} />
      </div>
    );
  }
);

CustomInput.displayName = 'CustomInput';

const ControlledCustomInput = ({
  control,
  name,
  errors,
  label,
  formatFn,
  ...restOfProps
}: ControlledCustomInputProps) => (
  <Controller
    control={control}
    name={name ? name : ''}
    render={({ field: { onChange, value, onBlur, ref } }) => (
      <CustomInput
        {...restOfProps}
        error={errors[name]?.message?.toString()}
        onBlur={onBlur}
        onChange={(value) => onChange(formatFn ? formatFn(value) : value)}
        label={label}
        value={value?.toString()}
        ref={ref}
      />
    )}
  />
);

export const ControlledCustomPasswordInput = (props: ControlledCustomInputProps) => {
  const [isHidden, setHidden] = useState<boolean>(true);

  const toggleHidden = useCallback(() => setHidden(!isHidden), [isHidden]);

  const icon = useMemo(
    () =>
      isHidden ? (
        <FaEye className="cursor-pointer" onClick={toggleHidden} />
      ) : (
        <FaEyeSlash className="cursor-pointer" onClick={toggleHidden} />
      ),
    [isHidden, toggleHidden]
  );

  const type = useMemo(() => (isHidden ? 'password' : 'text'), [isHidden]);

  return <ControlledCustomInput type={type} rightIcon={icon} autoComplete="on" {...props} />;
};

export default ControlledCustomInput;
