import { forwardRef, ReactElement, useCallback, useMemo, useState } from 'react';

import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { Box, IconButton, InputAdornment, TextField, TextFieldProps } from '@mui/material';
import { Control, Controller, FieldErrors } from 'react-hook-form';

type CustomInputProps = TextFieldProps & {
  errorMessage?: string;
  rightIcon?: ReactElement;
};

type ControlledCustomInputProps = {
  control: Control;
  name: string;
  errors: FieldErrors;
  label: string;
  formatFn?: (value: unknown) => string;
} & CustomInputProps;

const CustomInput = forwardRef(({ value, errorMessage, rightIcon, ...restOfProps }: CustomInputProps, ref) => {
  return (
    <Box ref={ref} sx={{ display: 'flex' }}>
      <TextField
        {...restOfProps}
        variant="outlined"
        fullWidth
        margin="normal"
        value={value || ''}
        error={!!errorMessage}
        helperText={errorMessage}
        slotProps={{
          input: {
            endAdornment: <InputAdornment position="end">{rightIcon}</InputAdornment>,
          },
        }}
      />
    </Box>
  );
});

CustomInput.displayName = 'CustomInput';

const ControlledCustomInput = ({ control, name, errors, formatFn, ...restOfProps }: ControlledCustomInputProps) => (
  <Controller
    control={control}
    name={name ? name : ''}
    render={({ field: { onChange, value, onBlur, ref } }) => (
      <CustomInput
        {...restOfProps}
        errorMessage={errors[name]?.message?.toString()}
        onBlur={onBlur}
        onChange={(value) => onChange(formatFn ? formatFn(value) : value)}
        value={value?.toString()}
        ref={ref}
      />
    )}
  />
);

export const ControlledCustomPasswordInput = (props: ControlledCustomInputProps) => {
  const [isHidden, setHidden] = useState<boolean>(true);

  const toggleHidden = useCallback(() => setHidden(!isHidden), [isHidden]);

  const icon = useMemo(() => (isHidden ? <VisibilityRoundedIcon /> : <VisibilityOffRoundedIcon />), [isHidden]);

  const type = useMemo(() => (isHidden ? 'password' : 'text'), [isHidden]);

  return (
    <ControlledCustomInput
      type={type}
      rightIcon={
        <IconButton color="inherit" onClick={toggleHidden}>
          {icon}
        </IconButton>
      }
      autoComplete="on"
      {...props}
    />
  );
};

export default ControlledCustomInput;
