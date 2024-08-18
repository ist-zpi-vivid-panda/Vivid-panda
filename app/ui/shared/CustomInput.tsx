import { forwardRef, InputHTMLAttributes, ReactElement, useState } from 'react';

import { Controller } from 'react-hook-form';
import { FaAsterisk, FaEyeSlash, FaEye } from 'react-icons/fa6';

type CustomInputProps = {
  label?: string;
  placeholder?: string;
  onChange: () => void;
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

    const handleInputBlur = (blurCallback, formData) => {
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
              ref={ref}
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

export const ControlledCustomInput = ({ control, name, errors, label, formatFn, ...restOfProps }) => (
  <Controller
    control={control}
    name={name ? name : ''}
    render={({ field: { onChange, value, onBlur, ref } }) => (
      <CustomInput
        {...restOfProps}
        error={errors[name]?.message}
        onBlur={onBlur}
        onChange={async (value) => onChange(formatFn ? await formatFn(value) : value)}
        label={label}
        value={value?.toString()}
        ref={ref}
      />
    )}
  />
);

export const ControlledCustomPasswordInput = (props) => {
  const textType = 'text';
  const passwordType = 'password';

  const [type, setType] = useState<typeof textType | typeof passwordType>(passwordType);

  const eye = (
    <FaEye
      className="cursor-pointer"
      onClick={() => {
        setType(passwordType);
        setIcon(eyeOff);
      }}
    />
  );

  const eyeOff = (
    <FaEyeSlash
      className="cursor-pointer"
      onClick={() => {
        setType(textType);
        setIcon(eye);
      }}
    />
  );

  const [icon, setIcon] = useState<typeof eye | typeof eyeOff>(eyeOff);

  return <ControlledCustomInput {...props} type={type} rightIcon={icon} autoComplete="on" />;
};

export default ControlledCustomInput;
