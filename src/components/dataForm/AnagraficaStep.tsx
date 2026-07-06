'use client';

import React, { useState } from 'react';
import { Alert, Grid, TextField, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import {
  decodeCodiceFiscale,
  isValidCodiceFiscale,
  normalizeCodiceFiscale,
} from '@/utils/codiceFiscale';

export default function AnagraficaStep() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const [cfHint, setCfHint] = useState<string | null>(null);
  const luogoNascita = watch('luogoNascita');
  const dataNascita = watch('dataNascita');

  const applyCodiceFiscale = (raw: string) => {
    const normalized = normalizeCodiceFiscale(raw);
    setValue('codiceFiscale', normalized, { shouldValidate: true });

    if (normalized.length < 16) {
      setCfHint(null);
      return;
    }

    if (!isValidCodiceFiscale(normalized)) {
      setCfHint(null);
      return;
    }

    const decoded = decodeCodiceFiscale(normalized);
    if (!decoded) return;

    setValue('dataNascita', decoded.dataNascita, { shouldValidate: true });
    setValue('luogoNascita', decoded.luogoNascita, { shouldValidate: true });
    setCfHint('Data e luogo di nascita compilati dal codice fiscale. Verifica nome e cognome.');
  };

  const validateMinimumAge = (value: string) => {
    if (!value) return 'Seleziona la data di nascita';

    const today = new Date();
    const birth = new Date(value);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;

    if (age < 14) return 'Devi avere almeno 14 anni per partecipare';
    if (birth > today) return 'La data non può essere futura';
    return true;
  };

  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Anagrafica
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Inserisci il codice fiscale per compilare automaticamente data e luogo di nascita.
        Nome e cognome vanno inseriti come sul documento.
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 8, lg: 6 }}>
          <TextField
            label="Codice fiscale*"
            fullWidth
            inputProps={{ autoComplete: 'off', style: { textTransform: 'uppercase' } }}
            {...register('codiceFiscale', {
              required: 'Inserisci il codice fiscale',
              validate: (v) => isValidCodiceFiscale(v) || 'Codice fiscale non valido',
              onChange: (e) => applyCodiceFiscale(e.target.value),
              setValueAs: (v) => normalizeCodiceFiscale(v),
            })}
            error={!!errors.codiceFiscale}
            helperText={
              (errors.codiceFiscale?.message as string) ||
              '16 caratteri — compiliamo data e luogo di nascita'
            }
          />
        </Grid>

        {cfHint && (
          <Grid size={12}>
            <Alert severity="info">{cfHint}</Alert>
          </Grid>
        )}

        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <TextField
            label="Nome*"
            fullWidth
            inputProps={{ autoComplete: 'given-name' }}
            {...register('nome', { required: 'Inserisci il nome' })}
            error={!!errors.nome}
            helperText={errors.nome?.message as string}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <TextField
            label="Cognome*"
            fullWidth
            inputProps={{ autoComplete: 'family-name' }}
            {...register('cognome', { required: 'Inserisci il cognome' })}
            error={!!errors.cognome}
            helperText={errors.cognome?.message as string}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <TextField
            label="Città di nascita*"
            fullWidth
            InputLabelProps={{ shrink: Boolean(luogoNascita) }}
            inputProps={{ autoComplete: 'off' }}
            {...register('luogoNascita', { required: 'Inserisci la città di nascita' })}
            error={!!errors.luogoNascita}
            helperText={errors.luogoNascita?.message as string}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <TextField
            label="Data di nascita*"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: Boolean(dataNascita) }}
            inputProps={{ autoComplete: 'bday' }}
            {...register('dataNascita', {
              required: 'Seleziona la data di nascita',
              validate: validateMinimumAge,
            })}
            error={!!errors.dataNascita}
            helperText={(errors.dataNascita?.message as string) || 'Età minima: 14 anni'}
          />
        </Grid>
      </Grid>
    </>
  );
}
