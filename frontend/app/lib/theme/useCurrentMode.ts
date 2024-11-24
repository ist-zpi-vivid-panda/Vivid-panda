import { useMemo } from 'react';

import { useColorScheme, useMediaQuery } from '@mui/material';

const useCurrentMode = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const { mode } = useColorScheme();

  const currentMode = useMemo(
    () => (!mode || mode === 'system' ? (prefersDarkMode ? 'dark' : 'light') : mode),
    [mode, prefersDarkMode]
  );

  return currentMode;
};

export default useCurrentMode;
