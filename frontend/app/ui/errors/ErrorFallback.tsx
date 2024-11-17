'use client';

import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';
import { FallbackProps } from 'react-error-boundary';

import BaseError from './BaseError';

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const { t } = useStrings(TranslationNamespace.Common);

  return (
    <BaseError
      errorText={`${t('something_went_wrong')}: ${error.message}`}
      buttonText={t('error:try_again')}
      onButtonClick={resetErrorBoundary}
    />
  );
};

export default ErrorFallback;
