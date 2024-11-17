'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { Children } from '@/app/lib/definitions';
import { Card } from '@mui/material';

type BaseErrorProps = {
  buttonText: string;
  onButtonClick: () => void;
  errorText: string;
  children?: Children;
};

const BaseError = ({ errorText, buttonText, onButtonClick, children }: BaseErrorProps) => {
  const [backgroundSize, setBackgroundSize] = useState<string>('20%');

  const updateBackgroundSize = useCallback(() => {
    const width = window.innerWidth;

    if (width >= 1280) {
      setBackgroundSize('50%'); // Large screens
    } else if (width >= 1024) {
      setBackgroundSize('30%'); // Medium screens
    } else if (width >= 640) {
      setBackgroundSize('20%'); // Small screens
    } else {
      setBackgroundSize('12%'); // Default size for smaller screens
    }
  }, []);

  useEffect(() => {
    updateBackgroundSize();

    window.addEventListener('resize', updateBackgroundSize);

    return () => window.removeEventListener('resize', updateBackgroundSize);
  }, [updateBackgroundSize]);

  return (
    <div
      className="logoSadBackground min-h-screen bg-center"
      style={{
        backgroundPosition: 'center',
        backgroundSize: backgroundSize,
        width: '100%',
        height: '100vh',
      }}
    >
      <Card style={{ backgroundColor: 'pink', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '20px',
            alignItems: 'center',
          }}
        >
          <p className="text-large" style={{ color: 'black' }}>
            {errorText}
          </p>

          <button className="text-large" style={{ color: 'black' }} onClick={onButtonClick}>
            {buttonText}
          </button>

          {children}
        </div>
      </Card>
    </div>
  );
};
export default BaseError;
