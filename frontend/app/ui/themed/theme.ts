import { createTheme, responsiveFontSizes } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    button: {
      textTransform: 'none',
    },
  },
});

export default responsiveFontSizes(theme);
