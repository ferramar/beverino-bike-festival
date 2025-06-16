// components/SkipLink.tsx
'use client';

import { useState } from 'react';
import { Box } from '@mui/material';

export default function SkipLink() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <Box
      component="a"
      href="#main-content"
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      sx={{
        position: 'absolute',
        left: isVisible ? '50%' : '-9999px',
        transform: isVisible ? 'translateX(-50%)' : 'none',
        top: isVisible ? '1rem' : 'auto',
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