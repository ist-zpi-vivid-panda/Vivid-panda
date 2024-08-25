'use client';

import { RegisterProps, registerUser } from '@/app/lib/api/authApi';
import { useConfiguredForm } from '@/app/lib/forms/useConfiguredForm';
import useUserData from '@/app/lib/storage/useUserData';
import { SCHEMA_NAMES } from '@/app/lib/validation/config';
import Auth from '@/app/ui/auth/Auth';
import { ControlledCustomInput, ControlledCustomPasswordInput } from '@/app/ui/shared/CustomInput';
import SubmitButton from '@/app/ui/shared/SubmitButton';
import { router } from 'next/client';
import Link from 'next/link';
import { FieldValues } from 'react-hook-form';

const Register = () => {
  const { login } = useUserData();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isDirty, isSubmitting, isSubmitted },
  } = useConfiguredForm({ schemaName: SCHEMA_NAMES.REGISTER_SCHEMA });

  const onSubmit = async (values: FieldValues) => {
    // check has internet connection

    const registerProps: RegisterProps = { email: values.email, password: values.password, username: values.username };

    if (await registerUser(login, registerProps)) {
      await router.replace({ pathname: '/auth/register' });
    }
  };

  return (
    <Auth onSubmit={handleSubmit(onSubmit)} onBack={() => console.log('back arrow')}>
      <span className="text-2xl m-auto">Register</span>

      <ControlledCustomInput control={control} errors={errors} label="Email" type="email" name="email" required />

      <ControlledCustomInput control={control} errors={errors} label="Username" name="username" />

      <ControlledCustomPasswordInput control={control} errors={errors} label="Password" name="password" required />

      <div className="flex justify-end mb-20">
        <SubmitButton />
      </div>

      <Link href="/auth/login">
        <span className="text-sm font-light">Already have an account? Login</span>
      </Link>
    </Auth>
  );
};

export default Register;
