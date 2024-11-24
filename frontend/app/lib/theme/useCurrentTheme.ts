import Colors from '@/constants/Colors';
import { createTheme, responsiveFontSizes } from '@mui/material/styles';

import useCurrentMode from './useCurrentMode';

const useCurrentTheme = () => {
  const mode = useCurrentMode();

  return responsiveFontSizes(
    createTheme({
      colorSchemes: { dark: true },
      typography: {
        button: {
          textTransform: 'none',
        },
      },
      palette: Colors[mode],
    })
  );
};

export default useCurrentTheme;
