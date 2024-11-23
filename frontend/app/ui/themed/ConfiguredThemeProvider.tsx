'use client';

import { ChildrenProp } from '@/app/lib/definitions';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';

import useCurrentTheme from '../../lib/theme/useCurrentTheme';

const ConfiguredThemeProvider = ({ children }: ChildrenProp) => {
  const theme = useCurrentTheme();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {children}
    </ThemeProvider>
  );
};

export default ConfiguredThemeProvider;
