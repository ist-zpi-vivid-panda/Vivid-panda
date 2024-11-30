import { forwardRef, ReactElement, useCallback, useMemo, useState } from 'react';

import useCurrentMode from '@/app/lib/theme/useCurrentMode';
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { Box, IconButton, InputAdornment, TextField, TextFieldProps } from '@mui/material';
import { Control, Controller, FieldErrors } from 'react-hook-form';

import ErrorField from './ErrorField';

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
  const mode = useCurrentMode();

  return (
    <Box ref={ref} sx={{ display: 'flex', flexDirection: 'column', marginBottom: 1 }}>
      <TextField
        {...restOfProps}
        variant="outlined"
        fullWidth
        {...(mode === 'dark' && { color: 'secondary' })}
        margin="normal"
        value={value || ''}
        error={!!errorMessage}
        slotProps={{
          input: {
            endAdornment: <InputAdornment position="end">{rightIcon}</InputAdornment>,
          },
        }}
        sx={{
          '& .MuiInputBase-input': {
            '@media (max-width: 400px)': {
              fontSize: '0.4rem',
            },
            '@media  (min-width: 400px) and (max-width: 700px)': {
              fontSize: '0.8rem',
            },
            '@media (min-width: 700px) and (max-width: 1366px)': {
              fontSize: '1rem',
            },
            '@media (min-width: 1366px)': {
              fontSize: '1.2rem',
            },
            '@media (min-width: 1920px) and (max-width: 2560px)': {
              fontSize: '1.4rem',
            },

            '@media (min-width: 2560px)': {
              fontSize: '1.6rem',
            },
          },
          '& .MuiFormHelperText-root': {
            fontSize: {
              '@media (max-width: 400px)': {
                fontSize: '0.2rem',
              },
              '@media  (min-width: 400px) and (max-width: 700px)': {
                fontSize: '0.5rem',
              },
              '@media (min-width: 700px) and (max-width: 1366px)': {
                fontSize: '0.7rem',
              },
              '@media (min-width: 1366px)': {
                fontSize: '0.8rem',
              },
              '@media (min-width: 1920px) and (max-width: 2560px)': {
                fontSize: '1.2rem',
              },

              '@media (min-width: 2560px)': {
                fontSize: '1.3rem',
              },
            },
          },
        }}
      />

      <ErrorField error={errorMessage} />
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
