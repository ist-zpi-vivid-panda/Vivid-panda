import { generateMetadataFunctor } from '@/app/lib/internationalization/utils';
import LicenseList from '@/app/ui/licenses/LicenseList';

export const generateMetadata = generateMetadataFunctor('licenses');

const LicenseListPage = () => <LicenseList />;

export default LicenseListPage;
