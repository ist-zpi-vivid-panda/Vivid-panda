import { getQueryClient } from '@/app/lib/storage/getQueryClient';
import FilesList from '@/app/ui/files/FilesList';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { Metadata } from 'next';

// ------------------ begin :: metadata ------------------
export const metadata: Metadata = {
  title: 'Files List',
};
// ------------------ end :: metadata ------------------

const FilesListPage = () => (
  <HydrationBoundary state={dehydrate(getQueryClient())}>
    <FilesList />
  </HydrationBoundary>
);

export default FilesListPage;
