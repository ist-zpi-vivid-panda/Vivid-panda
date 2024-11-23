'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { Children } from '@/app/lib/definitions';
import { TranslationNamespace } from '@/app/lib/internationalization/definitions';
import useStrings from '@/app/lib/internationalization/useStrings';
import { Box, Button, Card, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';

type BaseErrorProps = {
  buttonText: string;
  onButtonClick: () => void;
  errorText: string;
  children?: Children;
};

const BaseError = ({ errorText, buttonText, onButtonClick, children }: BaseErrorProps) => {
  const { t } = useStrings(TranslationNamespace.Common);
  const router = useRouter();

  const [backgroundSize, setBackgroundSize] = useState<string>('20%');

  const updateBackgroundSize = useCallback(() => {
    const width = window.innerWidth;

    if (width >= 1280) {
      setBackgroundSize('50%'); // Large screens
    } else if (width >= 1024) {
      setBackgroundSize('40%'); // Medium screens
    } else if (width >= 640) {
      setBackgroundSize('25%'); // Small screens
    } else {
      setBackgroundSize('20%'); // Default size for smaller screens
    }
  }, []);

  useEffect(() => {
    updateBackgroundSize();

    window.addEventListener('resize', updateBackgroundSize);

    return () => window.removeEventListener('resize', updateBackgroundSize);
  }, [updateBackgroundSize]);

  return (
    <>
      <Card
        sx={{
          display: 'flex',
          backgroundColor: 'pink',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          gap: 1.5,
          p: 1,
        }}
      >
        <Typography variant="h3">{errorText}</Typography>

        <Button variant="text" onClick={onButtonClick}>
          <Typography variant="h4">{buttonText}</Typography>
        </Button>

        <Button variant="text" onClick={() => router.replace('/')}>
          <Typography variant="h4">{t('main_page')}</Typography>
        </Button>

        {children}
      </Card>

      <Box
        className="logoSadBackground"
        sx={{
          flex: 1,
          backgroundPosition: 'center',
          backgroundSize: backgroundSize,
        }}
      />
    </>
  );
};
export default BaseError;
