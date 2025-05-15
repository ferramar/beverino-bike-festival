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
      dark: "#BF360C"
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
          fontWeight: "600",
          variants: [
            {
              props: { variant: "outlined"},
              style: {
                background: "transparent",
                border: "2px solid #BF360C",
                color: "#BF360C",
                ":hover": {
                  background: "#BF360C",
                  color: "#fff"
                }
              }
            }
          ]
        }
      }
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          "& > .MuiInputLabel-root": {
            color: "#000"
          }
        }
      }
    }
  },
});

export default theme;
