import ChangePassword from '@/app/ui/auth/ChangePassword';
import { Metadata } from 'next';

// ------------------ begin :: metadata ------------------
// can't use metadata and 'use client' in one file
export const metadata: Metadata = {
  title: 'Change password',
} as const;
// ------------------ end :: metadata ------------------

const ChangePasswordPage = () => {
  return <ChangePassword />;
};

export default ChangePasswordPage;
