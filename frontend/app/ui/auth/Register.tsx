'use client';

import { useCallback } from 'react';

import { RegisterProps, registerUser } from '@/app/lib/api/authApi';
import useConfiguredForm from '@/app/lib/forms/useConfiguredForm';
import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';
import useUserData from '@/app/lib/storage/useUserData';
import { SchemaNames } from '@/app/lib/validation/config';
import Auth from '@/app/ui/auth/Auth';
import ControlledCustomInput, { ControlledCustomPasswordInput } from '@/app/ui/forms/CustomInput';
import SubmitButton from '@/app/ui/forms/SubmitButton';
import { Box, Typography } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FieldValues } from 'react-hook-form';

import GoogleAuthButton from './GoogleAuthButton';
import ResponsiveTypography from '../themed/ResponsiveTypography';

const Register = () => {
  const router = useRouter();
  const { login } = useUserData();

  const { t } = useStrings(TranslationNamespace.AUTH);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useConfiguredForm({ schemaName: SchemaNames.RegisterSchema });

  const onSubmit = useCallback(
    async (values: FieldValues) => {
      const registerProps: RegisterProps = {
        email: values.email,
        password: values.password,
        username: values.username,
      };

      const loginResult = await registerUser(registerProps);

      if (loginResult) {
        login(loginResult);
        router.replace('/auth/login');
      }
    },
    [login, router]
  );

  return (
    <Auth onSubmit={handleSubmit(onSubmit)}>
      <Typography>{t('register')}</Typography>

      <Box>
        <ControlledCustomInput
          control={control}
          errors={errors}
          label={t('email')}
          type="email"
          name="email"
          required
        />

        <ControlledCustomInput control={control} errors={errors} label={t('username')} name="username" />

        <ControlledCustomPasswordInput
          control={control}
          errors={errors}
          label={t('password')}
          name="password"
          required
        />
      </Box>

      <Box className="flex justify-end custom-margin">
        <SubmitButton />
      </Box>

      <Box className="flex justify-end custom-margin">
        <GoogleAuthButton />
      </Box>

      <Link href="/auth/login">
        <ResponsiveTypography>{t('already_have_an_account')}</ResponsiveTypography>
      </Link>
    </Auth>
  );
};

export default Register;
