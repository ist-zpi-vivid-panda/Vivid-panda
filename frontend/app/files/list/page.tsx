import FilesList from '@/app/ui/files/FilesList';
import { Metadata } from 'next';

// ------------------ begin :: metadata ------------------
export const metadata: Metadata = Object.freeze({
  title: 'Files List',
} as const);
// ------------------ end :: metadata ------------------

const FilesListPage = () => <FilesList />;

export default FilesListPage;
