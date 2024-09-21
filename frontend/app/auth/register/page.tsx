import { getQueryClient } from '@/app/lib/storage/getQueryClient';
import Register from '@/app/ui/auth/Register';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';

// ------------------ begin :: metadata ------------------
// can't use metadata and 'use client' in one file
export const metadata: Metadata = {
  title: 'Register',
} as const;
// ------------------ end :: metadata ------------------

const RegisterPage = () => {
  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Register />
    </HydrationBoundary>
  );
};

export default RegisterPage;
