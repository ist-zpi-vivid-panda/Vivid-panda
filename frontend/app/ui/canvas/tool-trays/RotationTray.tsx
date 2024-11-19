'use client';

import { SetStateAction } from 'react';

import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';

type RotationTrayProps = {
  rotationStep: number;
  setRotation: (_: SetStateAction<number>) => void;
  currentRotation: number;
  defaultRotation: number;
};

const RotationTray = ({ rotationStep, setRotation, currentRotation, defaultRotation }: RotationTrayProps) => {
  const { t } = useStrings(TranslationNamespace.Canvas);

  return (
    <div className="text-large-edit">
      <span className="text-large-span">
        {t('rotation')}: {currentRotation.toFixed(1)}
      </span>

      <div className=" text-large-edit-less">
        <button onClick={() => setRotation((prev) => prev + rotationStep)}>
          {t('rotate_by')} {rotationStep}°
        </button>

        <button onClick={() => setRotation(defaultRotation)}>{t('reset')}</button>

        <button onClick={() => setRotation((prev) => prev - rotationStep)}>
          {t('rotate_by')} -{rotationStep}°
        </button>
      </div>
    </div>
  );
};

export default RotationTray;
