'use client';

import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';
import { Button } from '@mui/material';

const SubmitButton = () => {
  const { t } = useStrings(TranslationNamespace.Common);

  return (
    <Button
      sx={{
        '@media (max-width: 400px)': {
          fontSize: '0.3rem',
        },
        '@media (min-width: 400px) and (max-width: 700px)': {
          fontSize: '0.5rem',
        },
        '@media (min-width: 700px) and (max-width: 1366px)': {
          fontSize: '0.8rem',
        },

        '@media (min-width: 1366px) and (max-width: 1920px)': {
          fontSize: '1rem',
        },

        '@media (min-width: 1920px) and (max-width: 2560px)': {
          fontSize: '1.5rem',
        },

        '@media (min-width: 2560px)': {
          fontSize: '2rem',
        },
      }}
      type="submit"
      variant="contained"
    >
      {t('submit')}
    </Button>
  );
};

export default SubmitButton;
