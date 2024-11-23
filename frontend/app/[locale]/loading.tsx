'use client'; // Correct directive to indicate client component

import { useEffect, useState } from 'react';

import { Box } from '@mui/material';

const Loading = () => {
  const [backgroundSize, setBackgroundSize] = useState('20%');

  useEffect(() => {
    const updateBackgroundSize = () => {
      const width = window.innerWidth;

      if (width >= 1280) {
        setBackgroundSize('40%'); // Large screens
      } else if (width >= 1024) {
        setBackgroundSize('15%'); // Medium screens
      } else if (width >= 640) {
        setBackgroundSize('10%'); // Small screens
      } else {
        setBackgroundSize('8%'); // Default size for smaller screens
      }
    };
    updateBackgroundSize();
    window.addEventListener('resize', updateBackgroundSize);

    return () => window.removeEventListener('resize', updateBackgroundSize);
  }, []);

  return (
    <Box
      className="logoBackground min-h-screen bg-center"
      sx={{
        backgroundPosition: 'center',
        backgroundSize: backgroundSize,
        width: '100%',
        height: '100vh',
      }}
    >
      <Box className="loading-circle" />
    </Box>
  );
};

export default Loading;
