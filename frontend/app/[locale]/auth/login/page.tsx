import { generateMetadataFunctor } from '@/app/lib/internationalization/utils';
import Login from '@/app/ui/auth/Login';

export const generateMetadata = generateMetadataFunctor('login');

const LoginPage = () => <Login />;

export default LoginPage;
