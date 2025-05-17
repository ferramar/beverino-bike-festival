// src/components/Liberatoria/index.tsx

import React, { useState, useRef, UIEvent } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Typography,
  Paper,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';

/**
 * Liberatoria:
 * - Mostra un documento PDF scrollabile
 * - L’utente deve scrollare fino in fondo per abilitare la checkbox
 */
export default function Liberatoria() {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const [canAccept, setCanAccept] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
      setCanAccept(true);
    }
  };

  return (
    <>
      <Typography sx={visuallyHidden}>Visualizza ed accetta la liberatoria</Typography>
      <Paper
        ref={scrollRef}
        onScroll={handleScroll}
        variant="outlined"
        sx={{ height: {xs: 400, md: 600, lg: 700}, overflowY: 'auto', p: 2, mt: 6, mb: 4 }}
      >
        <Box
          component="iframe"
          src="/liberatoria.pdf"
          title="Liberatoria"
          width="100%"
          height="100%"
          sx={{ border: 0 }}
        />
      </Paper>

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
                Scorri fino in fondo al documento per abilitare l&apos;accettazione.
              </FormHelperText>
            )}
            {canAccept && errors.liberatoriaAccettata && (
              <FormHelperText error>
                {errors.liberatoriaAccettata.message?.toString()}
              </FormHelperText>
            )}
          </Box>
        )}
      />
    </>
  );
}
