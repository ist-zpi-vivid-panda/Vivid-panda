'use client';

import Auth from '@/app/ui/auth/Auth';
import { ControlledCustomInput, ControlledCustomPasswordInput } from '@/app/ui/shared/CustomInput';
import SubmitButton from '@/app/ui/shared/SubmitButton';
import { useConfiguredForm } from '@/forms/useConfiguredForm';
import Link from 'next/link';

const ForgotPassword = () => {
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
      <span className="text-2xl m-auto">Reset password</span>

      <ControlledCustomInput control={control} errors={errors} label="Email" type="email" name="email" required />

      <div className="flex justify-end mb-20">
        <SubmitButton />
      </div>

      <div className="underline">
        <Link href="/auth/login">
          <span className="text-sm font-light">Already have an account? Login</span>
        </Link>
      </div>
    </Auth>
  );
};

export default ForgotPassword;
