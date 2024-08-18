import Register from '@/app/ui/auth/Register';
import { Metadata } from 'next';

// ------------------ begin :: metadata ------------------
// can't use metadata and 'use client' in one file
export const metadata: Metadata = {
  title: 'Register',
};
// ------------------ end :: metadata ------------------

const RegisterPage = () => <Register />;

export default RegisterPage;
