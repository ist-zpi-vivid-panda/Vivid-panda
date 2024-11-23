'use client';

import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';
import { Button } from '@mui/material';

const SubmitButton = () => {
  const { t } = useStrings(TranslationNamespace.Common);

  return (
    <Button type="submit" variant="contained">
      {t('submit')}
    </Button>
  );
};

export default SubmitButton;
