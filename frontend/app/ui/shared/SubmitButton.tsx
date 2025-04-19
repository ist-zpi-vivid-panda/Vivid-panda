'use client';

import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';

const SubmitButton = () => {
  const { t } = useStrings(TranslationNamespace.Common);

  return (
    <button type="submit" className="btn-success rounded-xl px-10 py-4">
      {t('submit')}
    </button>
  );
};

export default SubmitButton;
