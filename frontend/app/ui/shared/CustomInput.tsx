import {
  FocusEvent,
  FocusEventHandler,
  forwardRef,
  InputHTMLAttributes,
  JSX,
  ReactElement,
  useCallback,
  useMemo,
  useState,
} from 'react';

import { Control, Controller } from 'react-hook-form';
import { FaAsterisk, FaEyeSlash, FaEye } from 'react-icons/fa6';

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

    const handleInputFocus = () => setIsFocused(true);

    const handleInputBlur = (
      blurCallback: (() => void) & FocusEventHandler<HTMLInputElement>,
      formData: FocusEvent<HTMLInputElement, Element>
    ) => {
      try {
        setIsFocused(false);
        blurCallback(formData);
      } catch {
        /* empty */
      }
    };

    const isNotEmpty = value && value.length > 0;
    const requiredAsterisk = required && <FaAsterisk size={6} className="danger" />;

    return (
      <>
        <div
          className={`${disabled && 'disabled'} ${isFocused && 'primaryBorder'} ${error && 'dangerBorder'} border-gray-500 textBackground overflow-hidden rounded-md p-2`}
        >
          {isNotEmpty && label && (
            <div className="flex flex-1 flex-row gap-1">
              <span className="text-sm ">{label}</span>
              {requiredAsterisk}
            </div>
          )}
          <div className="flex flex-row items-center relative">
            {!isNotEmpty && (
              <div className="pointer-events-none absolute gap-1 flex flex-row">
                <span>{placeholder || label}</span>
                {requiredAsterisk}
              </div>
            )}

            <input
              {...restOfProps}
              className="flex flex-1 rounded-md textBackground"
              onFocus={handleInputFocus}
              onBlur={(formData) => handleInputBlur(onBlur, formData)}
              onChange={onChange}
              value={value || ''}
              ref={ref as React.RefObject<HTMLInputElement>}
            />

            {rightIcon && <div className="absolute right-1">{rightIcon}</div>}
          </div>
        </div>
        <span className="danger">{error}</span>
      </>
    );
  }
);

CustomInput.displayName = 'CustomInput';

type ControlledCustomInputProps = {
  control: Control; // Define the type of control prop
  name: string;
  errors: any;
  label: string;
  formatFn?: (value: any) => any;
} & CustomInputProps;

export const ControlledCustomInput = ({
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
        error={errors[name]?.message}
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

  const toggleHidden = useCallback(() => setHidden(isHidden), [isHidden]);

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
