'use client';

import React from 'react';
import { Grid, TextField, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import ComuneAutocomplete from './ComuneAutocomplete';

export default function ResidenzaStep() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const comuneResidenza = watch('comuneResidenza') || '';

  const handleComuneChange = (nome: string, cap?: string) => {
    setValue('comuneResidenza', nome, { shouldValidate: true });
    if (cap) {
      setValue('cap', cap, { shouldValidate: true });
    }
  };

  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Residenza e contatti
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Seleziona il comune dall&apos;elenco: il CAP viene compilato automaticamente quando disponibile.
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <ComuneAutocomplete
            label="Comune di residenza"
            value={comuneResidenza}
            onChange={handleComuneChange}
            required
            error={!!errors.comuneResidenza}
            helperText={errors.comuneResidenza?.message as string}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <TextField
            label="Via/Corso/Piazza*"
            placeholder="Via Roma, Corso Italia, ..."
            fullWidth
            inputProps={{ autoComplete: 'street-address' }}
            {...register('residenza', { required: 'Inserisci la via di residenza' })}
            error={!!errors.residenza}
            helperText={errors.residenza?.message as string}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <TextField
            label="Numero civico*"
            fullWidth
            inputProps={{ autoComplete: 'off' }}
            {...register('numeroCivico', { required: 'Inserisci il numero civico' })}
            error={!!errors.numeroCivico}
            helperText={errors.numeroCivico?.message as string}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <TextField
            label="CAP*"
            fullWidth
            inputProps={{ autoComplete: 'postal-code' }}
            {...register('cap', { required: 'Inserisci il CAP' })}
            error={!!errors.cap}
            helperText={errors.cap?.message as string}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <TextField
            label="Email*"
            type="email"
            fullWidth
            inputProps={{ autoComplete: 'email' }}
            {...register('email', {
              required: 'Inserisci la mail',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Inserisci un indirizzo email valido',
              },
            })}
            error={!!errors.email}
            helperText={
              (errors.email?.message as string) || 'Riceverai qui la conferma di iscrizione'
            }
          />
        </Grid>
      </Grid>
    </>
  );
}
