import Register from '@/app/ui/auth/Register';
import { Metadata } from 'next';

// ------------------ begin :: metadata ------------------
// can't use metadata and 'use client' in one file
export const metadata: Metadata = {
  title: 'Register',
} as const;
// ------------------ end :: metadata ------------------

const RegisterPage = () => {
  return <Register />;
};

export default RegisterPage;
