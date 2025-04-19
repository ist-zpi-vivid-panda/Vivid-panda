'use client';

import { useCallback } from 'react';

import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';
import { useRouter } from 'next/navigation';

import BaseError from './BaseError';

const NotFoundError = () => {
  const router = useRouter();
  const { t } = useStrings(TranslationNamespace.ERROR);

  const handleBack = useCallback(() => router.back(), [router]);

  return <BaseError errorText={t('error')} buttonText={t('back')} onButtonClick={handleBack} />;
};

export default NotFoundError;
