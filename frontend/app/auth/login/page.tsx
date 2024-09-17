import { getQueryClient } from '@/app/lib/storage/getQueryClient';
import Login from '@/app/ui/auth/Login';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';

// ------------------ begin :: metadata ------------------
// can't use metadata and 'use client' in one file
export const metadata: Metadata = {
  title: 'Login',
} as const;
// ------------------ end :: metadata ------------------

const LoginPage = () => {
  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Login />
    </HydrationBoundary>
  );
};

export default LoginPage;
