'use client';
import { useState, useEffect, useCallback } from 'react';

<<<<<<< HEAD
import { changePassword, ChangePasswordProps, RequestSendPasswordProps } from '@/app/lib/api/authApi';
import { useConfiguredForm } from '@/app/lib/forms/useConfiguredForm';
import { SCHEMA_NAMES } from '@/app/lib/validation/config';
import { ControlledCustomPasswordInput } from '@/app/ui/shared/CustomInput';
import { useRouter } from 'next/navigation';
import { FieldValues } from 'react-hook-form';
import { useParams } from 'react-router-dom';

import Auth from './Auth';
import SubmitButton from '../shared/SubmitButton';
=======
import useConfiguredForm from '@/app/lib/forms/useConfiguredForm';
import { SchemaNames } from '@/app/lib/validation/config';
import Auth from '@/app/ui/auth/Auth';
import { ControlledCustomPasswordInput } from '@/app/ui/shared/CustomInput';
import SubmitButton from '@/app/ui/shared/SubmitButton';
>>>>>>> 37c5320eac91e6d63f6f838500e4fb21fdaddc8c

const ChangePassword = () => {
  const router = useRouter();
  const { resetCode, userId } = useParams();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isDirty, isSubmitting, isSubmitted },
<<<<<<< HEAD
  } = useConfiguredForm({ schemaName: SCHEMA_NAMES.LOGIN_SCHEMA });
=======
  } = useConfiguredForm({ schemaName: SchemaNames.ResetPasswordSchema });
>>>>>>> 37c5320eac91e6d63f6f838500e4fb21fdaddc8c

  const onSubmit = useCallback(
    (values: FieldValues) => {
      if (resetCode && userId) {
        const changePasswordData: ChangePasswordProps = {
          password: values.password,
          password_repeated: values.password_repeated,
        };
        changePassword(changePasswordData, resetCode, userId);
      }

      router.replace('/auth/login');
    },
    [resetCode, router, userId]
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
