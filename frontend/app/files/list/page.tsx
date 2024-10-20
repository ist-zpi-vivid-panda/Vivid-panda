import FilesList from '@/app/ui/files/FilesList';
import { Metadata } from 'next';

// ------------------ begin :: metadata ------------------
export const metadata: Metadata = {
  title: 'Files List',
} as const;
// ------------------ end :: metadata ------------------

const FilesListPage = () => {
  return <FilesList />;
};

export default FilesListPage;
