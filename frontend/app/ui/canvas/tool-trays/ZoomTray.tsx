'use client';

import { SetStateAction } from 'react';

import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';

type ZoomTrayProps = {
  zoomStep: number;
  setZoom: (_: SetStateAction<number>) => void;
  currentZoom: number;
  defaultZoom: number;
};

const ZoomTray = ({ zoomStep, setZoom, currentZoom, defaultZoom }: ZoomTrayProps) => {
  const { t } = useStrings(TranslationNamespace.Canvas);

  return (
    <div>
      <span>
        {t('zoom')}: {currentZoom}
      </span>

      <div className="flex-row">
        <button onClick={() => setZoom((prev) => prev + zoomStep)}>+</button>

        <button onClick={() => setZoom(defaultZoom)}>{t('reset')}</button>

        <button onClick={() => setZoom((prev) => prev - zoomStep)}>-</button>
      </div>
    </div>
  );
};

export default ZoomTray;
