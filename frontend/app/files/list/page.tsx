import { getQueryClient } from '@/app/lib/storage/getQueryClient';
import FilesList from '@/app/ui/files/FilesList';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';

// ------------------ begin :: metadata ------------------
export const metadata: Metadata = {
  title: 'Files List',
} as const;
// ------------------ end :: metadata ------------------

const FilesListPage = () => {
  const queryClient = getQueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FilesList />
    </HydrationBoundary>
  );
};

export default FilesListPage;
