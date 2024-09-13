'use client';

import useConfiguredForm from '@/app/lib/forms/useConfiguredForm';
import { SchemaNames } from '@/app/lib/validation/config';
import Auth from '@/app/ui/auth/Auth';
import { ControlledCustomInput, ControlledCustomPasswordInput } from '@/app/ui/shared/CustomInput';
import SubmitButton from '@/app/ui/shared/SubmitButton';
import Link from 'next/link';

const ForgotPassword = () => {
  const {
    control,
    reset,
    handleSubmit,
    setError,
    formState: { errors, isDirty, isSubmitting, isSubmitted },
  } = useConfiguredForm({ schemaName: SchemaNames.SendEmailRequestSchema });

  const onSubmit = () => {};

  return (
    <Auth onSubmit={handleSubmit(onSubmit)}>
      <span className="text-2xl m-auto">Reset password</span>

      <ControlledCustomInput control={control} errors={errors} label="Email" type="email" name="email" required />

      <div className="flex justify-end mb-20">
        <SubmitButton />
      </div>

      <Link href="/auth/login">
        <span className="text-sm font-light">Already have an account? Login</span>
      </Link>
    </Auth>
  );
};

export default ForgotPassword;
