import { generateMetadataFunctor } from '@/app/lib/internationalization/metadata';
import Register from '@/app/ui/auth/Register';

export const generateMetadata = generateMetadataFunctor('register');

const RegisterPage = () => <Register />;

export default RegisterPage;
