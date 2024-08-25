import { getQueryClient } from '@/app/lib/storage/getQueryClient';
import Register from '@/app/ui/auth/Register';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';

// ------------------ begin :: metadata ------------------
// can't use metadata and 'use client' in one file
export const metadata: Metadata = {
  title: 'Register',
};
// ------------------ end :: metadata ------------------

const RegisterPage = () => (
  <HydrationBoundary state={dehydrate(getQueryClient())}>
    <Register />
  </HydrationBoundary>
);

export default RegisterPage;
