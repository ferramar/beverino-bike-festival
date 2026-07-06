'use client';

import React, { useCallback } from 'react';
import { CircularProgress, Grid, InputAdornment, TextField, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import ComuneAutocomplete from './ComuneAutocomplete';
import ViaAutocomplete from './ViaAutocomplete';
import CivicoAutocomplete from './CivicoAutocomplete';
import { useCapLookup } from '@/hooks/useCapLookup';

export default function ResidenzaStep() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const comuneResidenza = watch('comuneResidenza') || '';
  const residenza = watch('residenza') || '';
  const numeroCivico = watch('numeroCivico') || '';
  const cap = watch('cap');

  const handleComuneChange = (nome: string) => {
    setValue('comuneResidenza', nome, { shouldValidate: true });
    setValue('residenza', '', { shouldValidate: false });
    setValue('numeroCivico', '', { shouldValidate: false });
    setValue('cap', '', { shouldValidate: false });
  };

  const handleViaChange = (via: string) => {
    setValue('residenza', via, { shouldValidate: true });
    setValue('numeroCivico', '', { shouldValidate: false });
    setValue('cap', '', { shouldValidate: false });
  };

  const handleCivicoChange = (civico: string) => {
    setValue('numeroCivico', civico, { shouldValidate: true });
  };

  const onCapFound = useCallback(
    (foundCap: string) => {
      setValue('cap', foundCap, { shouldValidate: true });
    },
    [setValue]
  );

  const { loading: capLoading, notFound: capNotFound } = useCapLookup({
    comune: comuneResidenza,
    via: residenza,
    civico: numeroCivico,
    onCapFound,
  });

  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Residenza e contatti
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Seleziona comune, via e numero civico: il CAP viene ricavato automaticamente dall&apos;indirizzo
        completo. Se non lo troviamo, puoi inserirlo manualmente.
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
          <ViaAutocomplete
            comune={comuneResidenza}
            value={residenza}
            onChange={handleViaChange}
            error={!!errors.residenza}
            helperText={errors.residenza?.message as string}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <CivicoAutocomplete
            comune={comuneResidenza}
            via={residenza}
            value={numeroCivico}
            onChange={handleCivicoChange}
            error={!!errors.numeroCivico}
            helperText={errors.numeroCivico?.message as string}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <TextField
            label="CAP*"
            fullWidth
            InputLabelProps={{ shrink: Boolean(cap) }}
            inputProps={{ autoComplete: 'postal-code' }}
            {...register('cap', { required: 'Inserisci il CAP' })}
            error={!!errors.cap}
            helperText={
              (errors.cap?.message as string) ||
              (capLoading
                ? 'Ricerca CAP in corso...'
                : capNotFound && comuneResidenza && residenza && numeroCivico
                  ? 'CAP non trovato automaticamente — inseriscilo manualmente'
                  : 'Compilato dal numero civico quando possibile')
            }
            InputProps={{
              endAdornment: capLoading ? (
                <InputAdornment position="end">
                  <CircularProgress size={18} />
                </InputAdornment>
              ) : undefined,
            }}
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
