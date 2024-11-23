'use client';
import { useCallback } from 'react';

import { ChangePasswordProps, changePassword } from '@/app/lib/api/authApi';
import useConfiguredForm from '@/app/lib/forms/useConfiguredForm';
import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';
import { SchemaNames } from '@/app/lib/validation/config';
import Auth from '@/app/ui/auth/Auth';
import { ControlledCustomPasswordInput } from '@/app/ui/shared/CustomInput';
import SubmitButton from '@/app/ui/shared/SubmitButton';
import { Box } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { FieldValues } from 'react-hook-form';

import ResponsiveTypography from '../themed/ResponsiveTypography';

const ChangePassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const userId = searchParams.get('user_id');

  const { t } = useStrings(TranslationNamespace.Auth);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useConfiguredForm({ schemaName: SchemaNames.ResetPasswordSchema });

  const onSubmit = useCallback(
    (values: FieldValues) => {
      if (token && userId) {
        const changePasswordData: ChangePasswordProps = {
          password: values.password,
          password_repeated: values.password_repeated,
        };

        changePassword(changePasswordData, token as string, userId as string);
      }

      router.replace('/auth/login');
    },
    [token, router, userId]
  );
  return (
    <Auth onSubmit={handleSubmit(onSubmit)}>
      <ResponsiveTypography>{t('change_password')}</ResponsiveTypography>

      <ControlledCustomPasswordInput control={control} errors={errors} label={t('password')} name="password" required />

      <ControlledCustomPasswordInput
        control={control}
        errors={errors}
        label={t('repeat_password')}
        name="password_repeated"
        required
      />

      <Box className="flex justify-end custom-margin">
        <SubmitButton />
      </Box>
    </Auth>
  );
};

export default ChangePassword;
