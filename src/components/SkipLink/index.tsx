// components/SkipLink.tsx
'use client';

import { Box } from '@mui/material';

export default function SkipLink() {
  return (
    <Box
      component="a"
      href="#main-content"
      sx={{
        position: 'absolute',
        left: '-9999px',
        zIndex: 9999,
        padding: '1em 2em',
        backgroundColor: 'primary.main',
        color: 'white',
        textDecoration: 'none',
        borderRadius: 1,
        fontWeight: 600,
        boxShadow: 3,
        transition: 'all 0.2s ease',
        '&:hover': {
          backgroundColor: 'primary.dark',
        },
        '&:focus': {
          left: '50%',
          transform: 'translateX(-50%)',
          top: '1rem',
          outline: '3px solid',
          outlineColor: 'orange.500',
          outlineOffset: '2px',
        },
      }}
    >
      Salta al contenuto principale
    </Box>
  );
}