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

/**
 * Liberatoria Step:
 * - Embed PDF con <object> su desktop
 * - Fallback pulsante su dispositivi touch o viewport <= lg
 * - Checkbox abilitata dopo scroll (desktop) o click pulsante (touch)
 */
export default function Liberatoria() {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const theme = useTheme();
  const isTouch = useMediaQuery('(pointer: coarse)');
  const isBelowLg = useMediaQuery(theme.breakpoints.down('lg'));
  const useButtonFlow = isTouch || isBelowLg;

  const [canAccept, setCanAccept] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
      setCanAccept(true);
    }
  };

  const handleOpenLiberatoria = () => {
    window.open('/liberatoria.pdf', '_blank', 'noopener,noreferrer');
    setCanAccept(true);
  };

  return (
    <>
      <Typography sx={visuallyHidden} component="span">
        Procedura di visualizzazione e accettazione liberatoria
      </Typography>

      {useButtonFlow ? (
        <Box textAlign="center" sx={{ my: 4 }}>
          <Button variant="contained" onClick={handleOpenLiberatoria}>
            Visualizza liberatoria
          </Button>
        </Box>
      ) : (
        <Paper
          ref={containerRef}
          onScroll={handleScroll}
          variant="outlined"
          sx={{ height: 600, overflowY: 'auto', p: 2, mt: 4, mb: 3 }}
        >
          <object
            data="/liberatoria.pdf"
            type="application/pdf"
            width="100%"
            height="100%"
          >
            <Typography>
              Il tuo browser non supporta PDF.
              <a href="/liberatoria.pdf" target="_blank" rel="noopener noreferrer">
                Scarica liberatoria
              </a>.
            </Typography>
          </object>
        </Paper>
      )}

      <Controller
        name="liberatoriaAccettata"
        control={control}
        rules={{ required: 'Devi accettare la liberatoria per procedere' }}
        render={({ field }) => (
          <Box>
            <FormControlLabel
              control={<Checkbox {...field} checked={field.value || false} disabled={!canAccept} />}
              label="Ho letto e accetto la liberatoria"
            />
            {!canAccept && (
              <FormHelperText>
                {useButtonFlow
                  ? 'Apri la liberatoria per poter accettare.'
                  : 'Scorri fino in fondo per abilitare.'}
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