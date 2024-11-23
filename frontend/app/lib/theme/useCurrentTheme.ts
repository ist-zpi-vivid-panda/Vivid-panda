import { useMemo } from 'react';

import Colors from '@/constants/Colors';
import { useMediaQuery } from '@mui/material';
import { createTheme, responsiveFontSizes, useColorScheme } from '@mui/material/styles';

const useCurrentTheme = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const { mode } = useColorScheme();

  const currentMode = useMemo(
    () => (!mode || mode === 'system' ? (prefersDarkMode ? 'dark' : 'light') : mode),
    [mode, prefersDarkMode]
  );

  return responsiveFontSizes(
    createTheme({
      colorSchemes: { dark: true },
      typography: {
        button: {
          textTransform: 'none',
        },
      },
      palette: Colors[currentMode],
    })
  );
};

export default useCurrentTheme;
