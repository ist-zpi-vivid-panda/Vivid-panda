import Login from '@/app/ui/auth/Login';
import { Metadata } from 'next';

// ------------------ begin :: metadata ------------------
// can't use metadata and 'use client' in one file
export const metadata: Metadata = Object.freeze({
  title: 'Login',
} as const);
// ------------------ end :: metadata ------------------

const LoginPage = () => <Login />;

export default LoginPage;
