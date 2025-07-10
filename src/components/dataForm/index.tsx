/* eslint-disable */
import React, { useMemo, useState } from 'react';
import { useWatch, useFormContext } from 'react-hook-form';
import { Box, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';

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
  // Dati genitore
  nomeGenitore?: string;
  cognomeGenitore?: string;
  luogoNascitaGenitore?: string;
  dataNascitaGenitore?: string;
  comuneResidenzaGenitore?: string;
  viaResidenzaGenitore?: string;
  numeroCivicoGenitore?: string;
  capGenitore?: string;
  emailGenitore?: string;
  tipoDocumentoGenitore?: string;
  numeroDocumentoGenitore?: string;
  cittaRilascioGenitore?: string;
  dataRilascioDocumentoGenitore?: string;
  // Dati tutore/accompagnatore
  nomeTutore?: string;
  cognomeTutore?: string;
}

export default function DataForm() {
  const {
    register,
    control,
    formState: { errors },
    watch,
  } = useFormContext<FormData>();

  // Watch per i valori dei select
  const tipoDocumentoValue = watch('tipoDocumento');
  const tipoDocumentoGenitoreValue = watch('tipoDocumentoGenitore');
  const birthDateValue = useWatch({ control, name: 'dataNascita' });

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

  return (
    <Box component="form" noValidate sx={{ mt: 6, mb: 4 }}>
      <Typography sx={visuallyHidden}>Inserisci i dati personali</Typography>
      
      {/* Sezione dati partecipante */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Dati del partecipante
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
            label="Via/Corso/Piazza*"
            placeholder='Via Roma, Corso Italia, ...'
            fullWidth
            {...register('residenza', { required: 'Inserisci la via di residenza' })}
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
            label="CAP*"
            fullWidth
            {...register('cap', { required: 'Inserisci il CAP', })}
            error={!!errors.cap}
            helperText={errors.cap?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <TextField
            label="Email*"
            type='email'
            fullWidth
            {...register('email', {
              required: 'Inserisci la mail',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Inserisci un indirizzo email valido'
              }
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </Grid>
        
        {/* Sezione documento */}
        <Grid size={12} sx={{ mt: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            Documento d'identità
          </Typography>
        </Grid>
        
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
              <MenuItem value={'cartaIdentita'}>Carta d'identità</MenuItem>
              <MenuItem value={'patente'}>Patente</MenuItem>
            </Select>
            {errors.tipoDocumento && (
              <FormHelperText>{errors.tipoDocumento.message}</FormHelperText>
            )}
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <TextField
            label="Numero documento*"
            fullWidth
            {...register('numeroDocumento', { required: 'Inserisci il numero documento' })}
            error={!!errors.numeroDocumento}
            helperText={errors.numeroDocumento?.message}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <TextField
            label="Città di rilascio*"
            fullWidth
            {...register('cittaRilascio', { required: 'Inserisci la città di rilascio del documento' })}
            error={!!errors.cittaRilascio}
            helperText={errors.cittaRilascio?.message}
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
              validate: value =>
                new Date(value) <= new Date() || 'La data non può essere futura',
            })}
            error={!!errors.dataRilascioDocumento}
            helperText={errors.dataRilascioDocumento?.message}
          />
        </Grid>
        
        {/* Sezione genitore se minore */}
        {isMinor && (
          <>
            <Grid size={12} sx={{ mt: 4, mb: 2 }}>
              <Typography variant="h6" color="primary">
                Dati del genitore/tutore legale
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Essendo il partecipante minorenne, è necessario inserire i dati di chi esercita la potestà genitoriale
              </Typography>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <TextField
                label="Nome genitore*"
                fullWidth
                {...register('nomeGenitore', {
                  required: isMinor ? 'Inserisci il nome del genitore' : false,
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
                  required: isMinor ? 'Inserisci il cognome del genitore' : false,
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
                  required: isMinor ? 'Inserisci la città di nascita del genitore' : false,
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
                  required: isMinor ? 'Seleziona la data di nascita del genitore' : false,
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
                  required: isMinor ? 'Inserisci il comune di residenza del genitore' : false,
                })}
                error={!!errors.comuneResidenzaGenitore}
                helperText={errors.comuneResidenzaGenitore?.message}
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
                helperText={errors.viaResidenzaGenitore?.message}
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
                helperText={errors.numeroCivicoGenitore?.message}
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
                helperText={errors.capGenitore?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <TextField
                label="Email genitore*"
                type='email'
                fullWidth
                {...register('emailGenitore', {
                  required: isMinor ? 'Inserisci la mail del genitore' : false,
                  pattern: isMinor ? {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Inserisci un indirizzo email valido'
                  } : undefined
                })}
                error={!!errors.emailGenitore}
                helperText={errors.emailGenitore?.message}
              />
            </Grid>
            
            {/* Documento genitore */}
            <Grid size={12} sx={{ mt: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                Documento d'identità del genitore
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
                    required: isMinor ? 'Seleziona il tipo di documento del genitore' : false
                  })}
                >
                  <MenuItem value={'cartaIdentita'}>Carta d'identità</MenuItem>
                  <MenuItem value={'patente'}>Patente</MenuItem>
                </Select>
                {errors.tipoDocumentoGenitore && (
                  <FormHelperText>{errors.tipoDocumentoGenitore.message}</FormHelperText>
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
                helperText={errors.numeroDocumentoGenitore?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <TextField
                label="Città di rilascio documento genitore*"
                fullWidth
                {...register('cittaRilascioGenitore', {
                  required: isMinor ? 'Inserisci la città di rilascio del documento del genitore' : false,
                })}
                error={!!errors.cittaRilascioGenitore}
                helperText={errors.cittaRilascioGenitore?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
              <TextField
                label="Data rilascio documento genitore*"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                {...register('dataRilascioDocumentoGenitore', {
                  required: isMinor ? 'Seleziona la data di rilascio del documento del genitore' : false,
                  validate: value =>
                    !isMinor || (value && new Date(value) <= new Date()) || 'La data non può essere futura',
                })}
                error={!!errors.dataRilascioDocumentoGenitore}
                helperText={errors.dataRilascioDocumentoGenitore?.message}
              />
            </Grid>
            {/* Sezione tutore accompagnatore */}
            <Grid size={12} sx={{ mt: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 500, color: 'text.secondary' }}>
                Tutore accompagnatore (solo se il genitore non potrà presenziare)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Nel caso in cui il genitore del minore non partecipasse al raduno, indicare le generalità di un tutore maggiorenne che ne partecipi
              </Typography>
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Nome tutore"
                fullWidth
                {...register('nomeTutore')}
                error={!!errors.nomeTutore}
                helperText={errors.nomeTutore?.message}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Cognome tutore"
                fullWidth
                {...register('cognomeTutore')}
                error={!!errors.cognomeTutore}
                helperText={errors.cognomeTutore?.message}
              />
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
}