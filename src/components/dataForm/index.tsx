import React, { useMemo, useState } from 'react';
import { useForm, SubmitHandler, useWatch } from 'react-hook-form';
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';

interface FormData {
  nome: string;
  cognome: string;
  luogoNascita: string;
  dataNascita: string;
  residenza: string;
  numeroCivico: string;
  cap: string;
  email: string;
  tipoDocumento: string;
  numeroDocumento: string;
  cittaRilascio: string;
  dataRilascioDocumento: string;
  nomeGenitore?: string;
  cognomeGenitore?: string;
  luogoNascitaGenitore?: string;
  dataNascitaGenitore?: string;
  comuneResidenzaGenitore?: string;
  provinciaGenitore?: string;
}

export default function DataForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onSubmit",
  });

  const [documentType, setDocumentType] = useState('');
  const birthDateValue = useWatch({ control, name: 'dataNascita' });

  const handleChange = (event: SelectChangeEvent) => {
    setDocumentType(event.target.value as string);
  };

  const isMinor = useMemo(() => {
    if (!birthDateValue) return false;
    const today = new Date();
    const birth = new Date(birthDateValue);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age < 18;
  }, [birthDateValue]);

  const onSubmit: SubmitHandler<FormData> = (data: FormData) => {
    console.log('Dati inviati:', data);
    // Qui puoi gestire l'invio dei dati all'API
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ my: 2 }}>
      <Typography variant="h6" gutterBottom>
        Dati Personali
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <TextField
            label="Nome*"
            fullWidth
            {...register('nome', { required: 'Inserisci il nome' })}
            error={!!errors.nome}
            helperText={errors.nome?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <TextField
            label="Cognome*"
            fullWidth
            {...register('cognome', { required: 'Inserisci il cognome' })}
            error={!!errors.cognome}
            helperText={errors.cognome?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <TextField
            label="Città di nascita*"
            fullWidth
            {...register('luogoNascita', { required: 'Inserisci la città di nascita' })}
            error={!!errors.luogoNascita}
            helperText={errors.luogoNascita?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <TextField
            label="Data di nascita*"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            {...register('dataNascita', {
              required: 'Seleziona la data di nascita',
              validate: value =>
                new Date(value) <= new Date() || 'La data non può essere futura',
            })}
            error={!!errors.dataNascita}
            helperText={errors.dataNascita?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <TextField
            label="Residenza*"
            placeholder='Via, Corso, ...'
            fullWidth
            {...register('residenza', { required: 'Inserisci la residenza' })}
            error={!!errors.residenza}
            helperText={errors.residenza?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <TextField
            label="Numero civico*"
            fullWidth
            {...register('numeroCivico', { required: 'Inserisci il numero civico' })}
            error={!!errors.numeroCivico}
            helperText={errors.numeroCivico?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <TextField
            label="Cap*"
            fullWidth
            {...register('cap', { required: 'Inserisci il cap', })}
            error={!!errors.cap}
            helperText={errors.cap?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <TextField
            label="Email*"
            type='email'
            fullWidth
            {...register('email', { required: 'Inserisci la mail' })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <FormControl fullWidth>
            <InputLabel id="tipo-documento">Tipo documento*</InputLabel>
            <Select
              labelId="tipo-documento"
              id="tipo-documento-select"
              value={documentType}
              label="Tipo documento"
              {...register('tipoDocumento', { required: 'Inserisci tipologia documento' })}
              onChange={handleChange}
            >
              <MenuItem value={'cartaIdentita'}>Carta d&apos;identità</MenuItem>
              <MenuItem value={'patente'}>Patente</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <TextField
            label="Numero documento*"
            fullWidth
            {...register('numeroDocumento', { required: 'Inserisci il numero documento', })}
            error={!!errors.cap}
            helperText={errors.cap?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <TextField
            label="Città di rilascio*"
            fullWidth
            {...register('cittaRilascio', { required: 'Inserisci la città di rilascio del documento', })}
            error={!!errors.cap}
            helperText={errors.cap?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <TextField
            label="Rilasciato il*"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            {...register('dataRilascioDocumento', {
              required: 'Seleziona la data di rilascio',
              validate: value =>
                new Date(value) <= new Date() || 'La data non può essere futura',
            })}
            error={!!errors.dataNascita}
            helperText={errors.dataNascita?.message}
          />
        </Grid>
        {isMinor && (
          <>
            <Grid size={12} sx={{my: 4}}>
              <Typography fontWeight={600}>
                In caso di minorenne, indicare i dati di chi esercita la potestà genitoriale
              </Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <TextField
                label="Nome genitore*"
                fullWidth
                {...register('nomeGenitore', {
                  required: isMinor && 'Inserisci il nome del genitore',
                })}
                error={!!errors.nomeGenitore}
                helperText={errors.nomeGenitore?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <TextField
                label="Cognome genitore*"
                fullWidth
                {...register('cognomeGenitore', {
                  required: isMinor && 'Inserisci il cognome del genitore',
                })}
                error={!!errors.cognomeGenitore}
                helperText={errors.cognomeGenitore?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <TextField
                label="Città di nascita genitore*"
                fullWidth
                {...register('luogoNascitaGenitore', {
                  required: isMinor && 'Inserisci la città di nascita del genitore',
                })}
                error={!!errors.luogoNascitaGenitore}
                helperText={errors.luogoNascitaGenitore?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <TextField
                label="Data di nascita genitore*"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                {...register('dataNascitaGenitore', {
                  required: isMinor && 'Seleziona la data di nascita del genitore',
                  validate: value =>
                    !isMinor || (value && new Date(value) <= new Date()) || 'Data non valida',
                })}
                error={!!errors.dataNascitaGenitore}
                helperText={errors.dataNascitaGenitore?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <TextField
                label="Comune di residenza genitore*"
                fullWidth
                {...register('comuneResidenzaGenitore', {
                  required: isMinor && 'Inserisci il comune di residenza del genitore',
                })}
                error={!!errors.comuneResidenzaGenitore}
                helperText={errors.comuneResidenzaGenitore?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <TextField
                label="Provincia genitore*"
                fullWidth
                {...register('provinciaGenitore', {
                  required: isMinor && 'Inserisci la provincia del genitore',
                })}
                error={!!errors.provinciaGenitore}
                helperText={errors.provinciaGenitore?.message}
              />
            </Grid>
          </>
        )}
        <Grid size={12} sx={{
          textAlign: "right"
        }}>
          <Button type="submit" variant="contained" color="primary" size="large">
            Prosegui
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}