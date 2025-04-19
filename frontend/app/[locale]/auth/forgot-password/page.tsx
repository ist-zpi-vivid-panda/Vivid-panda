import { generateMetadataFunctor } from '@/app/lib/internationalization/metadata';
import ForgotPassword from '@/app/ui/auth/ForgotPassword';

export const generateMetadata = generateMetadataFunctor('forgot_password');

const ForgotPasswordPage = () => <ForgotPassword />;

export default ForgotPasswordPage;
