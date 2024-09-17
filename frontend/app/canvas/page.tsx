import ImageEditingScreen from '@/app/ui/drawing/ImageEditingScreen';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';

import { getQueryClient } from '../lib/storage/getQueryClient';

// ------------------ begin :: metadata ------------------
// can't use metadata and 'use client' in one file
export const metadata: Metadata = {
  title: 'Canvas',
} as const;
// ------------------ end :: metadata ------------------

const CanvasPage = () => {
  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ImageEditingScreen />
    </HydrationBoundary>
  );
};

export default CanvasPage;
