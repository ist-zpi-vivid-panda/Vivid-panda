'use client';

import { useCallback } from 'react';

import { LoginProps, loginUser } from '@/app/lib/api/authApi';
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

const Login = () => {
  const router = useRouter();
  const { login } = useUserData();

  const { t } = useStrings(TranslationNamespace.AUTH);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useConfiguredForm({ schemaName: SchemaNames.LoginSchema });

  const onSubmit = useCallback(
    async (values: FieldValues) => {
      const loginProps: LoginProps = { email: values.email, password: values.password };

      const loginResult = await loginUser(loginProps);

      if (loginResult) {
        login(loginResult);
        router.replace('/auth/login');
      }
    },
    [login, router]
  );

  return (
    <Auth onSubmit={handleSubmit(onSubmit)}>
      <Typography className="text-2xl m-auto">{t('login')}</Typography>

      <Box>
        <ControlledCustomInput
          control={control}
          errors={errors}
          label={t('email')}
          type="email"
          name="email"
          required
        />

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

      <Box className="flex flex-row justify-between gap-10">
        <Link href="/auth/forgot-password">
          <ResponsiveTypography>{t('restore_password')}</ResponsiveTypography>
        </Link>

        <Link href="/auth/register">
          <ResponsiveTypography>{t('create_account')}</ResponsiveTypography>
        </Link>
      </Box>
    </Auth>
  );
};

export default Login;
