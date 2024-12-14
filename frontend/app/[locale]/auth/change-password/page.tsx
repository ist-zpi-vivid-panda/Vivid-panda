import { generateMetadataFunctor } from '@/app/lib/internationalization/metadata';
import ChangePassword from '@/app/ui/auth/ChangePassword';

export const generateMetadata = generateMetadataFunctor('change_password');

const ChangePasswordPage = () => <ChangePassword />;

export default ChangePasswordPage;
