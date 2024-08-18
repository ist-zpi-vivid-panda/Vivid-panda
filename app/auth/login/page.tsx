import Login from '@/app/ui/auth/Login';
import { Metadata } from 'next';

// ------------------ begin :: metadata ------------------
// can't use metadata and 'use client' in one file
export const metadata: Metadata = {
  title: 'Login',
};
// ------------------ end :: metadata ------------------

const LoginPage = () => <Login />;

export default LoginPage;
