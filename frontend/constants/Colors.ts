import { PaletteOptions } from '@mui/material';

const lightTheme: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#58007a',
  },
  secondary: {
    main: '#f9d7fe',
  },
  error: {
    main: '#a80000',
  },
  info: {
    main: '#005e75',
  },
  warning: {
    main: '#685308',
  },
  success: {
    main: '#006122',
  },
  background: {
    paper: '#f3f3f3',
  },
};

const darkTheme: PaletteOptions = {
  mode: 'dark',
  primary: {
    main: '#58007a',
  },
  secondary: {
    main: '#f9d7fe',
  },
  error: {
    main: '#ffb1a8',
  },
  info: {
    main: '#00d5ff',
  },
  warning: {
    main: '#ffb647',
  },
  success: {
    main: '#66e16a',
  },
};

const Colors = { light: lightTheme, dark: darkTheme };

export default Colors;
