import { getQueryClient } from '@/app/lib/storage/getQueryClient';
import ForgotPassword from '@/app/ui/auth/ForgotPassword';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';

// ------------------ begin :: metadata ------------------
// can't use metadata and 'use client' in one file
export const metadata: Metadata = {
  title: 'Forgot password',
} as const;
// ------------------ end :: metadata ------------------

const ForgotPasswordPage = () => {
  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ForgotPassword />
    </HydrationBoundary>
  );
};

export default ForgotPasswordPage;
