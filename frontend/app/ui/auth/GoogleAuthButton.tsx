import { useCallback, useMemo } from 'react';

import { googleAuth } from '@/app/lib/api/authApi';
import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';
import { DEFAULT_LOCALE } from '@/app/lib/internationalization/utils';
import useUserData from '@/app/lib/storage/useUserData';
import ENV_VARS from '@/constants/envVars';
import { CredentialResponse, GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const GoogleAuthButton = () => {
  const router = useRouter();
  const { login } = useUserData();

  const { t, i18n } = useStrings(TranslationNamespace.Error);

  const onSuccess = useCallback(
    async (credentialResponse: CredentialResponse) => {
      const googleResult = await googleAuth(credentialResponse);

      if (googleResult) {
        login(googleResult);
        router.replace('/auth/login');
      }
    },
    [login, router]
  );

  const onError = useCallback(() => toast.error(t('unknown_error')), [t]);

  const locale = useMemo(() => i18n.language || DEFAULT_LOCALE, [i18n.language]);

  return (
    <GoogleOAuthProvider clientId={ENV_VARS.GOOGLE_CLIENT_ID}>
      <GoogleLogin onSuccess={onSuccess} onError={onError} locale={locale} />
    </GoogleOAuthProvider>
  );
};

export default GoogleAuthButton;
