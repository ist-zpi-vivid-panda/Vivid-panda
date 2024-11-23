import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';
import { Button } from '@mui/material';

type CropTrayProps = { handleCrop: () => void };

const CropTray = ({ handleCrop }: CropTrayProps) => {
  const { t } = useStrings(TranslationNamespace.Canvas);

  return (
    <Button variant="contained" onClick={handleCrop}>
      {t('crop')}
    </Button>
  );
};

export default CropTray;
