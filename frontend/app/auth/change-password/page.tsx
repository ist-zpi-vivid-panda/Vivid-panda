import ChangePassword from '@/app/ui/auth/ChangePassword';
import { Metadata } from 'next';

// ------------------ begin :: metadata ------------------
// can't use metadata and 'use client' in one file
export const metadata: Metadata = {
  title: 'Change password',
};
// ------------------ end :: metadata ------------------

const ChangePasswordPage = () => <ChangePassword />;

export default ChangePasswordPage;
