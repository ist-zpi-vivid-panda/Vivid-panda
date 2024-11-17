import { Dispatch, SetStateAction, useCallback } from 'react';

import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';
import { Button } from '@mui/material';

type LocaleChangeButtonProps = {
  setAnchorEl: Dispatch<SetStateAction<HTMLElement | null>>;
};

const LocaleChangeButton = ({ setAnchorEl }: LocaleChangeButtonProps) => {
  const { t } = useStrings(TranslationNamespace.Common);

  const handleOpenLangMenu = useCallback(
    (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget),
    [setAnchorEl]
  );

  return (
    <Button onClick={handleOpenLangMenu} sx={{ my: 2, color: 'white', display: 'block' }}>
      {t('language')}
    </Button>
  );
};

export default LocaleChangeButton;
