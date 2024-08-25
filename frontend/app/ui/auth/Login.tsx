'use client';

import { LoginProps, loginUser } from '@/app/lib/api/authApi';
import { useConfiguredForm } from '@/app/lib/forms/useConfiguredForm';
import useUserData from '@/app/lib/storage/useUserData';
import { SCHEMA_NAMES } from '@/app/lib/validation/config';
import Auth from '@/app/ui/auth/Auth';
import { ControlledCustomInput, ControlledCustomPasswordInput } from '@/app/ui/shared/CustomInput';
import SubmitButton from '@/app/ui/shared/SubmitButton';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FieldValues } from 'react-hook-form';

const Login = () => {
  const router = useRouter();
  const { login } = useUserData();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isDirty, isSubmitting, isSubmitted },
  } = useConfiguredForm({ schemaName: SCHEMA_NAMES.LOGIN_SCHEMA });

  const onSubmit = async (values: FieldValues) => {
    // check has internet connection

    const loginProps: LoginProps = { email: values.email, password: values.password };

    if (await loginUser(login, loginProps)) {
      await router.replace('/auth/login');
    }
  };

  return (
    <Auth onSubmit={handleSubmit(onSubmit)} onBack={() => console.log('back arrow')}>
      <span className="text-2xl m-auto">Login</span>

      <ControlledCustomInput control={control} errors={errors} label="Email" type="email" name="email" required />

      <ControlledCustomPasswordInput control={control} errors={errors} label="Password" name="password" required />

      <div className="flex justify-end mb-20">
        <SubmitButton />
      </div>

      <div className="flex flex-row justify-between gap-10">
        <Link href="/auth/forgot-password">
          <span className="text-sm font-light">Forgot password</span>
        </Link>

        <Link href="/auth/register">
          <span className="text-sm font-light">Create an account</span>
        </Link>
      </div>
    </Auth>
  );
};

export default Login;
