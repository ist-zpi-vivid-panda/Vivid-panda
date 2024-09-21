'use client';
import { useState, useEffect, useCallback } from 'react';

import { ChangePasswordProps, changePassword } from '@/app/lib/api/authApi';
import useConfiguredForm from '@/app/lib/forms/useConfiguredForm';
import { SchemaNames } from '@/app/lib/validation/config';
import Auth from '@/app/ui/auth/Auth';
import { ControlledCustomPasswordInput } from '@/app/ui/shared/CustomInput';
import SubmitButton from '@/app/ui/shared/SubmitButton';
import { useParams, useRouter } from 'next/navigation';
import { FieldValues } from 'react-hook-form';
import { useSearchParams } from 'next/navigation'

const ChangePassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token')
  const userId = searchParams.get('user_id')


  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isDirty, isSubmitting, isSubmitted },
  } = useConfiguredForm({ schemaName: SchemaNames.ResetPasswordSchema });

  const onSubmit = useCallback(
    (values: FieldValues) => {
      console.log(`token ${token}`)
      console.log(`user_id ${userId}`)
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
      <span className="text-2xl m-auto">Change password</span>

      <ControlledCustomPasswordInput control={control} errors={errors} label="Password" name="password" required />

      <ControlledCustomPasswordInput
        control={control}
        errors={errors}
        label="Repeat password"
        name="password_repeated"
        required
      />

      <div className="flex justify-end mb-20">
        <SubmitButton />
      </div>
    </Auth>
  );
};

export default ChangePassword;
