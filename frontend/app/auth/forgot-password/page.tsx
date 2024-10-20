import ForgotPassword from '@/app/ui/auth/ForgotPassword';
import { Metadata } from 'next';

// ------------------ begin :: metadata ------------------
// can't use metadata and 'use client' in one file
export const metadata: Metadata = {
  title: 'Forgot password',
} as const;
// ------------------ end :: metadata ------------------

const ForgotPasswordPage = () => {
  return <ForgotPassword />;
};

export default ForgotPasswordPage;
