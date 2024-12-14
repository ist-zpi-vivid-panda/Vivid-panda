import { generateMetadataFunctor } from '@/app/lib/internationalization/metadata';
import FilesList from '@/app/ui/files/FilesList';

export const generateMetadata = generateMetadataFunctor('files_list');

const FilesListPage = () => <FilesList />;

export default FilesListPage;
