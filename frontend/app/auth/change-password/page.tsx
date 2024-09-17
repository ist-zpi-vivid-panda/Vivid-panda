import { getQueryClient } from '@/app/lib/storage/getQueryClient';
import ChangePassword from '@/app/ui/auth/ChangePassword';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';

// ------------------ begin :: metadata ------------------
// can't use metadata and 'use client' in one file
export const metadata: Metadata = {
  title: 'Change password',
} as const;
// ------------------ end :: metadata ------------------

const ChangePasswordPage = () => {
  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ChangePassword />
    </HydrationBoundary>
  );
};

export default ChangePasswordPage;
