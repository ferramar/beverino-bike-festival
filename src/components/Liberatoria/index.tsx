// src/components/Liberatoria/index.tsx

import React, { useState, useRef, UIEvent } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';


export default function Liberatoria() {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [canAccept, setCanAccept] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Scroll handler per desktop
  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
      setCanAccept(true);
    }
  };

  const handleOpenLiberatoria = () => {
    // Apri il PDF in una nuova scheda
    window.open('/liberatoria.pdf', '_blank', 'noopener,noreferrer');
    // Sblocca subito la checkbox
    setCanAccept(true);
  };

  return (
    <>
      {/* Label accessibile */}
      <Typography sx={visuallyHidden} component="span">
        Visualizza ed accetta la liberatoria
      </Typography>

      {/* Viewer differenziato desktop/mobile */}
      {isMobile ? (
        <Box textAlign="center" sx={{ my: 4 }}>
          <Button
            variant="contained"
            onClick={handleOpenLiberatoria}
          >
            Visualizza liberatoria
          </Button>
        </Box>
      ) : (
        <Paper
          ref={containerRef}
          onScroll={handleScroll}
          variant="outlined"
          sx={{
            height: 600,
            overflowY: 'auto',
            p: 1,
            mt: 4,
            mb: 2,
          }}
        >
          <object
            data="/liberatoria.pdf"
            type="application/pdf"
            width="100%"
            height="100%"
          >
            <Typography>
              Il tuo browser non supporta i PDF; 
              <a href="/liberatoria.pdf" target="_blank" rel="noopener noreferrer">
                scarica la liberatoria
              </a>.
            </Typography>
          </object>
        </Paper>
      )}

      {/* Checkbox di accettazione */}
      <Controller
        name="liberatoriaAccettata"
        control={control}
        rules={{ required: 'Devi accettare la liberatoria per procedere' }}
        render={({ field }) => (
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  {...field}
                  checked={field.value || false}
                  disabled={!canAccept}
                />
              }
              label="Ho letto e accetto la liberatoria"
            />
            {!canAccept && !field.value && (
              <FormHelperText>
                {isMobile
                  ? 'Apri la liberatoria per poter accettare.'
                  : "Scorri fino in fondo per abilitare l'accettazione."}
              </FormHelperText>
            )}
            {field.value && errors.liberatoriaAccettata?.message && (
              <FormHelperText error>
                {errors.liberatoriaAccettata.message.toString()}
              </FormHelperText>
            )}
          </Box>
        )}
      />
    </>
  );
}
