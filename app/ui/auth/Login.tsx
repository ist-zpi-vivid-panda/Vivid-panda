'use client';

import Auth from '@/app/ui/auth/Auth';
import { ControlledCustomInput, ControlledCustomPasswordInput } from '@/app/ui/shared/CustomInput';
import SubmitButton from '@/app/ui/shared/SubmitButton';
import { useConfiguredForm } from '@/forms/useConfiguredForm';
import Link from 'next/link';

const Login = () => {
  const {
    control,
    reset,
    handleSubmit,
    setError,
    formState: { errors, isDirty, isSubmitting, isSubmitted },
  } = useConfiguredForm();

  const onSubmit = () => {};

  return (
    <Auth onSubmit={handleSubmit(onSubmit)} onBack={() => console.log('back arrow')}>
      <span className="text-2xl m-auto">Login</span>

      <ControlledCustomInput control={control} errors={errors} label="Email" type="email" name="email" required />

      <ControlledCustomPasswordInput control={control} errors={errors} label="Password" name="password" required />

      <div className="flex justify-end mb-20">
        <SubmitButton />
      </div>

      <div className="flex flex-row justify-between gap-10 underline">
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
