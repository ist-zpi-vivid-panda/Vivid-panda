'use client';
import { useState, useEffect } from 'react';

import { useConfiguredForm } from '@/app/lib/forms/useConfiguredForm';
import { SCHEMA_NAMES } from '@/app/lib/validation/config';
import { ControlledCustomPasswordInput } from '@/app/ui/shared/CustomInput';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Auth from './Auth';
import SubmitButton from '../shared/SubmitButton';

const ResetPassword = () => {
  const { resetCode } = useParams(); // Extract the reset code from the URL
  const [linkIsValid, setLinkIsValid] = useState(true); // Assume the link is valid initially
  const linkExpirationTime = 15 * 60 * 1000; // 15 minutes in milliseconds

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isDirty, isSubmitting, isSubmitted },
  } = useConfiguredForm({ schemaName: SCHEMA_NAMES.LOGIN_SCHEMA });

  useEffect(() => {
    const currentTime = new Date().getTime();
    const linkCreationTime = 'idk';
    const linkExpirationDate = linkCreationTime + linkExpirationTime;

    if (currentTime > linkExpirationTime) {
      setLinkIsValid(false);
    }
  }, [resetCode]);

  const onSubmit = (values: any) => {
    if (resetCode && linkIsValid) {
      ResetPassword();
    } else {
      toast.error('Invalid or expired password reset code', {
        position: 'top-right',
      });
    }
  };
  return (
    <Auth onSubmit={handleSubmit(onSubmit)}>
      <span className="text-2xl m-auto">Reset Password</span>
      <ControlledCustomPasswordInput control={control} errors={errors} label="Password" name="password" required />
      <ControlledCustomPasswordInput
        control={control}
        errors={errors}
        label="Confirm Password"
        name="passwordConfirm"
        required
      />
      <div className="flex justify-end mb-20">
        <SubmitButton />
      </div>
    </Auth>
  );
};

export default ResetPassword;
