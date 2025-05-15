import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
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
}

export default function DataForm() {
  const [documentType, setDocumentType] = useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setDocumentType(event.target.value as string);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onSubmit",
  });

  const onSubmit: SubmitHandler<FormData> = (data: FormData) => {
    console.log('Dati inviati:', data);
    // Qui puoi gestire l'invio dei dati all'API
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Dati Personali
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <TextField
            label="Nome"
            fullWidth
            {...register('nome', { required: 'Inserisci il nome' })}
            error={!!errors.nome}
            helperText={errors.nome?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <TextField
            label="Cognome"
            fullWidth
            {...register('cognome', { required: 'Inserisci il cognome' })}
            error={!!errors.cognome}
            helperText={errors.cognome?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <TextField
            label="Città di nascita"
            fullWidth
            {...register('luogoNascita', { required: 'Inserisci la città di nascita' })}
            error={!!errors.luogoNascita}
            helperText={errors.luogoNascita?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <TextField
            label="Data di nascita"
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
            label="Residenza"
            placeholder='Via, Corso, ...'
            fullWidth
            {...register('residenza', { required: 'Inserisci la residenza' })}
            error={!!errors.residenza}
            helperText={errors.residenza?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <TextField
            label="N°"
            fullWidth
            {...register('numeroCivico', { required: 'Inserisci il numero civico' })}
            error={!!errors.numeroCivico}
            helperText={errors.numeroCivico?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <TextField
            label="Cap"
            type='email'
            fullWidth
            {...register('cap', { required: 'Inserisci il cap', })}
            error={!!errors.cap}
            helperText={errors.cap?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <TextField
            label="Email"
            fullWidth
            {...register('email', { required: 'Inserisci la mail' })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <FormControl fullWidth>
            <InputLabel id="tipo-documento">Tipo documento</InputLabel>
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
        <Grid size={12}>
          <Button type="submit" variant="contained" color="primary">
            Invia
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}