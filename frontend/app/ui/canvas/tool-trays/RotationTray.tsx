'use client';

import { SetStateAction } from 'react';

import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';
import { Button } from '@mui/material';

import ResponsiveTypography from '../../themed/ResponsiveTypography';

type RotationTrayProps = {
  rotationStep: number;
  setRotation: (_: SetStateAction<number>) => void;
  currentRotation: number;
  defaultRotation: number;
};

const RotationTray = ({ rotationStep, setRotation, currentRotation, defaultRotation }: RotationTrayProps) => {
  const { t } = useStrings(TranslationNamespace.CANVAS);

  return (
    <>
      <ResponsiveTypography>
        {t('rotation')}: {currentRotation.toFixed(1)}
      </ResponsiveTypography>

      <Button variant="contained" onClick={() => setRotation((prev) => prev + rotationStep)}>
        {t('rotate_by')} {rotationStep}°
      </Button>

      <Button variant="contained" onClick={() => setRotation(defaultRotation)}>
        {t('reset')}
      </Button>

      <Button variant="contained" onClick={() => setRotation((prev) => prev - rotationStep)}>
        {t('rotate_by')} -{rotationStep}°
      </Button>
    </>
  );
};

export default RotationTray;
