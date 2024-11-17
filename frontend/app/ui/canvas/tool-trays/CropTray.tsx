import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';

type CropTrayProps = { handleCrop: () => void };

const CropTray = ({ handleCrop }: CropTrayProps) => {
  const { t } = useStrings(TranslationNamespace.Canvas);

  return (
    <div className="text-large-edit">
      <button onClick={handleCrop}>{t('crop')}</button>
    </div>
  );
};

export default CropTray;
