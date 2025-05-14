// src/theme.ts

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    text: {
      primary: "#000",
      secondary: "#fff"
    },
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#fff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontSize: '2.125rem', fontWeight: 500 },
    h2: { fontSize: '1.75rem', fontWeight: 500 },
    body1: { fontSize: '1rem' },
    button: { textTransform: 'none' },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          background: "#BF360C",
          color: "white",
          fontWeight: "600"
        }
      }
    },
  },
});

export default theme;
