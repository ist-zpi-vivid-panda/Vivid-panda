'use client';

import Auth from '@/app/ui/auth/Auth';
import { ControlledCustomPasswordInput } from '@/app/ui/shared/CustomInput';
import SubmitButton from '@/app/ui/shared/SubmitButton';
import { useConfiguredForm } from '@/forms/useConfiguredForm';
import Link from 'next/link';

const ChangePassword = () => {
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
      <span className="text-2xl m-auto">Change password</span>

      <ControlledCustomPasswordInput control={control} errors={errors} label="Password" name="password" required />

      <ControlledCustomPasswordInput
        control={control}
        errors={errors}
        label="Repeat password"
        name="password"
        required
      />

      <div className="flex justify-end mb-20">
        <SubmitButton />
      </div>
    </Auth>
  );
};

export default ChangePassword;
