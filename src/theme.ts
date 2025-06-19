// src/theme.ts
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      light: '#FF8A65',    // 300
      main: '#A52D0C',     // 700 - Il tuo colore principale old: #A52D0C
      dark: '#8A2C12',     // 800 più scuro
      contrastText: '#fff',
    },
    secondary: {
      light: '#FFE0B2',    // 100
      main: '#FDB274',     // 300 - Un arancione più chiaro per contrasto
      dark: '#F57C00',     // 700
      contrastText: '#000',
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#FB8C00',     // 400 dalla tua palette
    },
    info: {
      main: '#2196f3',
    },
    success: {
      main: '#4caf50',
    },
    text: {
      primary: '#141414',
      secondary: '#555',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
    // Colori custom dalla tua palette
    orange: {
      50: '#FFF5ED',       // FFE6ED
      100: '#FFEBD5',      // FFEBD5
      200: '#FFD2AA',      // FED2AA
      300: '#FFB274',      // FDB274
      400: '#FF8A3C',      // FB8C3C
      500: '#FB6616',      // FB6616
      600: '#EA4B0C',      // EA4B0C
      700: '#A52D0C',      // BF360C - MAIN
      800: '#8A2C12',      // 8A2C12
      900: '#7C2712',      // 7C2712
      950: '#431107',      // 431107
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { 
      fontSize: '3rem',
      fontWeight: 700,
      lineHeight: 1.2,
      '@media (min-width:600px)': {
        fontSize: '4rem',
      }
    },
    h2: { 
      fontSize: '2.125rem',
      fontWeight: 700,
      lineHeight: 1.3,
      '@media (min-width:600px)': {
        fontSize: '2.75rem',
      }
    },
    h3: { 
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: { 
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: { 
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: { 
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: { 
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: { 
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: { 
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: { 
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(191, 54, 12, 0.05)',
    '0px 4px 8px rgba(191, 54, 12, 0.08)',
    '0px 8px 16px rgba(191, 54, 12, 0.10)',
    '0px 12px 24px rgba(191, 54, 12, 0.12)',
    '0px 16px 32px rgba(191, 54, 12, 0.14)',
    '0px 20px 40px rgba(191, 54, 12, 0.16)',
    '0px 24px 48px rgba(191, 54, 12, 0.18)',
    '0px 28px 56px rgba(191, 54, 12, 0.20)',
    '0px 32px 64px rgba(191, 54, 12, 0.22)',
    '0px 36px 72px rgba(191, 54, 12, 0.24)',
    '0px 40px 80px rgba(191, 54, 12, 0.26)',
    '0px 44px 88px rgba(191, 54, 12, 0.28)',
    '0px 48px 96px rgba(191, 54, 12, 0.30)',
    '0px 52px 104px rgba(191, 54, 12, 0.32)',
    '0px 56px 112px rgba(191, 54, 12, 0.34)',
    '0px 60px 120px rgba(191, 54, 12, 0.36)',
    '0px 64px 128px rgba(191, 54, 12, 0.38)',
    '0px 68px 136px rgba(191, 54, 12, 0.40)',
    '0px 72px 144px rgba(191, 54, 12, 0.42)',
    '0px 76px 152px rgba(191, 54, 12, 0.44)',
    '0px 80px 160px rgba(191, 54, 12, 0.46)',
    '0px 84px 168px rgba(191, 54, 12, 0.48)',
    '0px 88px 176px rgba(191, 54, 12, 0.50)',
    '0px 92px 184px rgba(191, 54, 12, 0.52)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':focus-visible': {
          outline: '3px solid #FB6616',
          outlineOffset: '2px',
        },
        // Altri reset globali utili per accessibilità
        'a:focus-visible': {
          outline: '3px solid #FB6616',
          outlineOffset: '2px',
          borderRadius: '4px',
        },
        // Skip link (da aggiungere nel layout)
        '.skip-link': {
          position: 'absolute',
          left: '-9999px',
          zIndex: 999,
          padding: '1em',
          backgroundColor: '#A52D0C',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          '&:focus': {
            left: '50%',
            transform: 'translateX(-50%)',
            top: '1rem',
          },
        },
      },
    },
    MuiButton: {
      defaultProps: { 
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontSize: '1rem',
          fontWeight: 600,
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          backgroundColor: '#A52D0C',
          color: '#FFFFFF',
          '&:hover': {
            backgroundColor: '#8A2C12',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(191, 54, 12, 0.25)',
          },
        },
        outlined: {
          borderColor: '#A52D0C',
          color: '#A52D0C',
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
            borderColor: '#A52D0C',
            backgroundColor: 'rgba(191, 54, 12, 0.08)',
          },
        },
        text: {
          color: '#A52D0C',
          '&:hover': {
            backgroundColor: 'rgba(191, 54, 12, 0.08)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
        filled: {
          '&.MuiChip-colorPrimary': {
            backgroundColor: '#A52D0C',
            color: '#FFFFFF',
          },
        },
        outlined: {
          '&.MuiChip-colorPrimary': {
            borderColor: '#A52D0C',
            color: '#A52D0C',
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#A52D0C',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#A52D0C',
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#A52D0C',
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          '&.Mui-selected': {
            backgroundColor: '#A52D0C',
            color: '#FFFFFF',
            '&:hover': {
              backgroundColor: '#8A2C12',
            },
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#A52D0C',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        standardSuccess: {
          backgroundColor: 'rgba(76, 175, 80, 0.12)',
          color: '#2e7d32',
        },
        standardError: {
          backgroundColor: 'rgba(244, 67, 54, 0.12)',
          color: '#d32f2f',
        },
        standardWarning: {
          backgroundColor: 'rgba(251, 140, 0, 0.12)',
          color: '#e65100',
        },
        standardInfo: {
          backgroundColor: 'rgba(33, 150, 243, 0.12)',
          color: '#0277bd',
        },
      },
    },
  },
});

// Aggiungi le dichiarazioni TypeScript per i colori custom
declare module '@mui/material/styles' {
  interface Palette {
    orange: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
      950: string;
    };
  }
  interface PaletteOptions {
    orange?: {
      50?: string;
      100?: string;
      200?: string;
      300?: string;
      400?: string;
      500?: string;
      600?: string;
      700?: string;
      800?: string;
      900?: string;
      950?: string;
    };
  }
}

export default theme;