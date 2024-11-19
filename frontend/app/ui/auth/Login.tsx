'use client';

import { useCallback } from 'react';

import { LoginProps, loginUser } from '@/app/lib/api/authApi';
import useConfiguredForm from '@/app/lib/forms/useConfiguredForm';
import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';
import useUserData from '@/app/lib/storage/useUserData';
import { SchemaNames } from '@/app/lib/validation/config';
import Auth from '@/app/ui/auth/Auth';
import ControlledCustomInput, { ControlledCustomPasswordInput } from '@/app/ui/shared/CustomInput';
import SubmitButton from '@/app/ui/shared/SubmitButton';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FieldValues } from 'react-hook-form';

const Login = () => {
  const router = useRouter();
  const { login } = useUserData();

  const { t } = useStrings(TranslationNamespace.Auth);

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
      <span className="text-2xl m-auto">{t('login')}</span>

      <ControlledCustomInput control={control} errors={errors} label={t('email')} type="email" name="email" required />

      <ControlledCustomPasswordInput control={control} errors={errors} label={t('password')} name="password" required />

      <div className="flex justify-end custom-margin">
        <SubmitButton />
      </div>

      <div className="flex flex-row justify-between gap-10">
        <Link href="/auth/forgot-password">
          <span className="text-sm font-light">{t('restore_password')}</span>
        </Link>

        <Link href="/auth/register">
          <span className="text-sm font-light">{t('create_account')}</span>
        </Link>
      </div>
    </Auth>
  );
};

export default Login;
