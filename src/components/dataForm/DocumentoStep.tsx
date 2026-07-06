'use client';

import React, { useMemo, useState } from 'react';
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useFormContext, useWatch } from 'react-hook-form';
import ComuneAutocomplete from './ComuneAutocomplete';

export default function DocumentoStep() {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const [sameResidenceAsParticipant, setSameResidenceAsParticipant] = useState(false);

  const birthDateValue = useWatch({ control, name: 'dataNascita' });
  const tipoDocumentoValue = watch('tipoDocumento');
  const tipoDocumentoGenitoreValue = watch('tipoDocumentoGenitore');
  const comuneResidenzaGenitore = watch('comuneResidenzaGenitore') || '';

  const isMinor = useMemo(() => {
    if (!birthDateValue) return false;
    const today = new Date();
    const birth = new Date(birthDateValue);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age < 18;
  }, [birthDateValue]);

  const copyParticipantResidence = (checked: boolean) => {
    setSameResidenceAsParticipant(checked);
    if (!checked) return;

    const fields = [
      ['comuneResidenza', 'comuneResidenzaGenitore'],
      ['residenza', 'viaResidenzaGenitore'],
      ['numeroCivico', 'numeroCivicoGenitore'],
      ['cap', 'capGenitore'],
      ['email', 'emailGenitore'],
    ] as const;

    fields.forEach(([from, to]) => {
      const val = watch(from);
      if (val) setValue(to, val, { shouldValidate: true });
    });
  };

  const handleGenitoreComuneChange = (nome: string, cap?: string) => {
    setValue('comuneResidenzaGenitore', nome, { shouldValidate: true });
    if (cap) setValue('capGenitore', cap, { shouldValidate: true });
  };

  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Documento d&apos;identità
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <FormControl fullWidth error={!!errors.tipoDocumento}>
            <InputLabel id="tipo-documento">Tipo documento*</InputLabel>
            <Select
              labelId="tipo-documento"
              id="tipo-documento-select"
              value={tipoDocumentoValue || ''}
              label="Tipo documento*"
              {...register('tipoDocumento', { required: 'Seleziona il tipo di documento' })}
            >
              <MenuItem value="cartaIdentita">Carta d&apos;identità</MenuItem>
              <MenuItem value="patente">Patente</MenuItem>
            </Select>
            {errors.tipoDocumento && (
              <FormHelperText>{errors.tipoDocumento.message as string}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <TextField
            label="Numero documento*"
            fullWidth
            {...register('numeroDocumento', { required: 'Inserisci il numero documento' })}
            error={!!errors.numeroDocumento}
            helperText={errors.numeroDocumento?.message as string}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <TextField
            label="Città di rilascio*"
            fullWidth
            {...register('cittaRilascio', {
              required: 'Inserisci la città di rilascio del documento',
            })}
            error={!!errors.cittaRilascio}
            helperText={errors.cittaRilascio?.message as string}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <TextField
            label="Data di rilascio*"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            {...register('dataRilascioDocumento', {
              required: 'Seleziona la data di rilascio',
              validate: (value) =>
                new Date(value) <= new Date() || 'La data non può essere futura',
            })}
            error={!!errors.dataRilascioDocumento}
            helperText={errors.dataRilascioDocumento?.message as string}
          />
        </Grid>
      </Grid>

      {isMinor && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" color="primary" gutterBottom>
            Dati del genitore/tutore legale
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Essendo il partecipante minorenne, è necessario inserire i dati di chi esercita la
            potestà genitoriale.
          </Typography>

          <FormControlLabel
            control={
              <Checkbox
                checked={sameResidenceAsParticipant}
                onChange={(e) => copyParticipantResidence(e.target.checked)}
              />
            }
            label="Stessa residenza del partecipante"
            sx={{ mb: 2, display: 'block' }}
          />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <TextField
                label="Nome genitore*"
                fullWidth
                inputProps={{ autoComplete: 'given-name' }}
                {...register('nomeGenitore', {
                  required: isMinor ? 'Inserisci il nome del genitore' : false,
                })}
                error={!!errors.nomeGenitore}
                helperText={errors.nomeGenitore?.message as string}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <TextField
                label="Cognome genitore*"
                fullWidth
                inputProps={{ autoComplete: 'family-name' }}
                {...register('cognomeGenitore', {
                  required: isMinor ? 'Inserisci il cognome del genitore' : false,
                })}
                error={!!errors.cognomeGenitore}
                helperText={errors.cognomeGenitore?.message as string}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <TextField
                label="Città di nascita genitore*"
                fullWidth
                {...register('luogoNascitaGenitore', {
                  required: isMinor ? 'Inserisci la città di nascita del genitore' : false,
                })}
                error={!!errors.luogoNascitaGenitore}
                helperText={errors.luogoNascitaGenitore?.message as string}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <TextField
                label="Data di nascita genitore*"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                {...register('dataNascitaGenitore', {
                  required: isMinor ? 'Seleziona la data di nascita del genitore' : false,
                  validate: (value) =>
                    !isMinor || (value && new Date(value) <= new Date()) || 'Data non valida',
                })}
                error={!!errors.dataNascitaGenitore}
                helperText={errors.dataNascitaGenitore?.message as string}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <ComuneAutocomplete
                label="Comune di residenza genitore"
                value={comuneResidenzaGenitore}
                onChange={handleGenitoreComuneChange}
                required={isMinor}
                error={!!errors.comuneResidenzaGenitore}
                helperText={errors.comuneResidenzaGenitore?.message as string}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <TextField
                label="Via/Corso/Piazza genitore*"
                fullWidth
                {...register('viaResidenzaGenitore', {
                  required: isMinor ? 'Inserisci la via di residenza del genitore' : false,
                })}
                error={!!errors.viaResidenzaGenitore}
                helperText={errors.viaResidenzaGenitore?.message as string}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <TextField
                label="Numero civico genitore*"
                fullWidth
                {...register('numeroCivicoGenitore', {
                  required: isMinor ? 'Inserisci il numero civico del genitore' : false,
                })}
                error={!!errors.numeroCivicoGenitore}
                helperText={errors.numeroCivicoGenitore?.message as string}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <TextField
                label="CAP genitore*"
                fullWidth
                {...register('capGenitore', {
                  required: isMinor ? 'Inserisci il CAP del genitore' : false,
                })}
                error={!!errors.capGenitore}
                helperText={errors.capGenitore?.message as string}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <TextField
                label="Email genitore*"
                type="email"
                fullWidth
                inputProps={{ autoComplete: 'email' }}
                {...register('emailGenitore', {
                  required: isMinor ? 'Inserisci la mail del genitore' : false,
                  pattern: isMinor
                    ? {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Inserisci un indirizzo email valido',
                      }
                    : undefined,
                })}
                error={!!errors.emailGenitore}
                helperText={errors.emailGenitore?.message as string}
              />
            </Grid>

            <Grid size={12} sx={{ mt: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                Documento d&apos;identità del genitore
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <FormControl fullWidth error={!!errors.tipoDocumentoGenitore}>
                <InputLabel id="tipo-documento-genitore">Tipo documento genitore*</InputLabel>
                <Select
                  labelId="tipo-documento-genitore"
                  id="tipo-documento-genitore-select"
                  value={tipoDocumentoGenitoreValue || ''}
                  label="Tipo documento genitore*"
                  {...register('tipoDocumentoGenitore', {
                    required: isMinor ? 'Seleziona il tipo di documento del genitore' : false,
                  })}
                >
                  <MenuItem value="cartaIdentita">Carta d&apos;identità</MenuItem>
                  <MenuItem value="patente">Patente</MenuItem>
                </Select>
                {errors.tipoDocumentoGenitore && (
                  <FormHelperText>{errors.tipoDocumentoGenitore.message as string}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <TextField
                label="Numero documento genitore*"
                fullWidth
                {...register('numeroDocumentoGenitore', {
                  required: isMinor ? 'Inserisci il numero documento del genitore' : false,
                })}
                error={!!errors.numeroDocumentoGenitore}
                helperText={errors.numeroDocumentoGenitore?.message as string}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <TextField
                label="Città di rilascio documento genitore*"
                fullWidth
                {...register('cittaRilascioGenitore', {
                  required: isMinor
                    ? 'Inserisci la città di rilascio del documento del genitore'
                    : false,
                })}
                error={!!errors.cittaRilascioGenitore}
                helperText={errors.cittaRilascioGenitore?.message as string}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <TextField
                label="Data rilascio documento genitore*"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                {...register('dataRilascioDocumentoGenitore', {
                  required: isMinor
                    ? 'Seleziona la data di rilascio del documento del genitore'
                    : false,
                  validate: (value) =>
                    !isMinor ||
                    (value && new Date(value) <= new Date()) ||
                    'La data non può essere futura',
                })}
                error={!!errors.dataRilascioDocumentoGenitore}
                helperText={errors.dataRilascioDocumentoGenitore?.message as string}
              />
            </Grid>

            <Grid size={12} sx={{ mt: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                Tutore accompagnatore (solo se il genitore non potrà presenziare)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Nel caso in cui il genitore del minore non partecipasse al raduno, indicare le
                generalità di un tutore maggiorenne che ne partecipi.
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Nome tutore"
                fullWidth
                {...register('nomeTutore')}
                error={!!errors.nomeTutore}
                helperText={errors.nomeTutore?.message as string}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Cognome tutore"
                fullWidth
                {...register('cognomeTutore')}
                error={!!errors.cognomeTutore}
                helperText={errors.cognomeTutore?.message as string}
              />
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
}
