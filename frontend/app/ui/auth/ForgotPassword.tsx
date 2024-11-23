'use client';

import { useCallback } from 'react';

import { RequestSendPasswordProps, sendEmail } from '@/app/lib/api/authApi';
import useConfiguredForm from '@/app/lib/forms/useConfiguredForm';
import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';
import { SchemaNames } from '@/app/lib/validation/config';
import Auth from '@/app/ui/auth/Auth';
import ControlledCustomInput from '@/app/ui/shared/CustomInput';
import SubmitButton from '@/app/ui/shared/SubmitButton';
import { Box } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FieldValues } from 'react-hook-form';

import ResponsiveTypography from '../themed/ResponsiveTypography';

const ForgotPassword = () => {
  const router = useRouter();

  const { t } = useStrings(TranslationNamespace.Auth);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useConfiguredForm({ schemaName: SchemaNames.SendEmailRequestSchema });

  const onSubmit = useCallback(
    (values: FieldValues) => {
      const sendPasswordEmail: RequestSendPasswordProps = { email: values.email };

      sendEmail(sendPasswordEmail);

      router.replace('/auth/login');
    },
    [router]
  );

  return (
    <Auth onSubmit={handleSubmit(onSubmit)}>
      <ResponsiveTypography>{t('reset_password')}</ResponsiveTypography>

      <ControlledCustomInput control={control} errors={errors} label={t('email')} type="email" name="email" required />

      <Box className="flex justify-end mb-20">
        <SubmitButton />
      </Box>

      <Link href="/auth/login">
        <ResponsiveTypography>{t('already_have_an_account')}</ResponsiveTypography>
      </Link>
    </Auth>
  );
};

export default ForgotPassword;
