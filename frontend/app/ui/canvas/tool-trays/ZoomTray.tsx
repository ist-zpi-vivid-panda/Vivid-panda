'use client';

import { SetStateAction } from 'react';

import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import { Button } from '@mui/material';

type ZoomTrayProps = {
  zoomStep: number;
  setZoom: (_: SetStateAction<number>) => void;
  defaultZoom: number;
};

const ZoomTray = ({ zoomStep, setZoom, defaultZoom }: ZoomTrayProps) => {
  const { t } = useStrings(TranslationNamespace.Canvas);

  return (
    <>
      <Button variant="contained" onClick={() => setZoom((prev) => prev + zoomStep)}>
        <AddRoundedIcon />
      </Button>

      <Button variant="contained" onClick={() => setZoom(defaultZoom)}>
        {t('reset')}
      </Button>

      <Button variant="contained" onClick={() => setZoom((prev) => prev - zoomStep)}>
        <RemoveRoundedIcon />
      </Button>
    </>
  );
};

export default ZoomTray;
