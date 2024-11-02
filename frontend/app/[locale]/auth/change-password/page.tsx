import ChangePassword from '@/app/ui/auth/ChangePassword';
import { Metadata } from 'next';

// ------------------ begin :: metadata ------------------
// can't use metadata and 'use client' in one file
export const metadata: Metadata = Object.freeze({
  title: 'Change password',
} as const);
// ------------------ end :: metadata ------------------

const ChangePasswordPage = () => <ChangePassword />;

export default ChangePasswordPage;
