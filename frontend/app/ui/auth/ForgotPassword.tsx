'use client';

<<<<<<< HEAD
import { useCallback } from 'react';

import { RequestSendPasswordProps, sendEmail } from '@/app/lib/api/authApi';
import { useConfiguredForm } from '@/app/lib/forms/useConfiguredForm';
import { SCHEMA_NAMES } from '@/app/lib/validation/config';
import Auth from '@/app/ui/auth/Auth';
import { ControlledCustomInput } from '@/app/ui/shared/CustomInput';
=======
import useConfiguredForm from '@/app/lib/forms/useConfiguredForm';
import { SchemaNames } from '@/app/lib/validation/config';
import Auth from '@/app/ui/auth/Auth';
import ControlledCustomInput from '@/app/ui/shared/CustomInput';
>>>>>>> 37c5320eac91e6d63f6f838500e4fb21fdaddc8c
import SubmitButton from '@/app/ui/shared/SubmitButton';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FieldValues } from 'react-hook-form';

const ForgotPassword = () => {
  const router = useRouter();

  const {
    control,
    reset,
    handleSubmit,
    setError,
    formState: { errors, isDirty, isSubmitting, isSubmitted },
<<<<<<< HEAD
  } = useConfiguredForm({ schemaName: SCHEMA_NAMES.FORGOT_PASSWORD_EMAIL });

  const onSubmit = useCallback(
    (values: FieldValues) => {
      const sendPasswordEmail: RequestSendPasswordProps = { email: values.email };
=======
  } = useConfiguredForm({ schemaName: SchemaNames.SendEmailRequestSchema });
>>>>>>> 37c5320eac91e6d63f6f838500e4fb21fdaddc8c

      sendEmail(sendPasswordEmail);

      router.replace('/auth/login');
    },
    [router]
  );

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
