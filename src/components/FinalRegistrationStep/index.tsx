import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Divider,
  Checkbox,
  IconButton,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function FinalRegistrationStep() {
  const { watch, setValue, formState: { errors }, register } = useFormContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const tipoGara = watch('tipo_gara', '');
  const pastaPartyEnabled = watch('pasta_party_enabled', false);
  const pastaCount = watch('conteggio_pastaparty', 1);
  const selectedSize = watch('taglia_maglietta', '');

  // Registra i campi con validazione
  useEffect(() => {
    register('tipo_gara', { 
      required: 'Seleziona il tipo di gara' 
    });
    register('taglia_maglietta', { 
      required: 'Seleziona una taglia per la maglietta' 
    });
    register('pasta_party_enabled');
    register('conteggio_pastaparty');
  }, [register]);

  const handleGaraSelection = (tipo: 'ciclistica' | 'running') => {
    setValue('tipo_gara', tipo, { shouldValidate: true });
  };

  const handlePastaPartyToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue('pasta_party_enabled', event.target.checked);
    if (!event.target.checked) {
      setValue('conteggio_pastaparty', 0);
    } else {
      setValue('conteggio_pastaparty', 1);
    }
  };

  const incrementPasta = () => {
    setValue('conteggio_pastaparty', Math.min(pastaCount + 1, 20));
  };

  const decrementPasta = () => {
    setValue('conteggio_pastaparty', Math.max(pastaCount - 1, 1));
  };

  const handleSizeChange = (event: any) => {
    setValue('taglia_maglietta', event.target.value, { shouldValidate: true });
  };

  // Calcolo prezzi
  const prezzoGara = tipoGara === 'ciclistica' ? 25 : tipoGara === 'running' ? 10 : 0;
  const prezzoPastaParty = pastaPartyEnabled ? pastaCount * 12 : 0;
  const prezzoTotale = prezzoGara + prezzoPastaParty;

  return (
    <Box sx={{ py: 2 }}>
      {/* Sezione 1: Scelta tipo gara */}
      <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
        1. Scegli la tua gara
      </Typography>
      
      <Box 
        sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 2,
          mb: 4
        }}
      >
        {/* Card Gara Ciclistica */}
        <Card 
          sx={{ 
            cursor: 'pointer',
            border: 2,
            borderColor: tipoGara === 'ciclistica' ? 'primary.main' : 'divider',
            bgcolor: tipoGara === 'ciclistica' ? 'primary.50' : 'background.paper',
            transition: 'all 0.3s',
            '&:hover': {
              borderColor: 'primary.light',
              boxShadow: 2,
            }
          }}
          onClick={() => handleGaraSelection('ciclistica')}
        >
          <CardContent sx={{ textAlign: 'center' }}>
            <DirectionsBikeIcon 
              sx={{ 
                fontSize: 60, 
                color: tipoGara === 'ciclistica' ? 'primary.main' : 'text.secondary',
                mb: 2 
              }} 
            />
            <Typography variant="h6" gutterBottom>
              Raduno ciclistico
            </Typography>
            <Typography variant="h4" color="primary" gutterBottom>
              €25
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Percorsi attraverso paesaggi mozzafiato
            </Typography>
            {tipoGara === 'ciclistica' && (
              <CheckCircleIcon 
                sx={{ 
                  position: 'absolute', 
                  top: 10, 
                  right: 10, 
                  color: 'primary.main' 
                }} 
              />
            )}
          </CardContent>
        </Card>

        {/* Card Gara Running */}
        <Card 
          sx={{ 
            cursor: 'pointer',
            border: 2,
            borderColor: tipoGara === 'running' ? 'primary.main' : 'divider',
            bgcolor: tipoGara === 'running' ? 'primary.50' : 'background.paper',
            transition: 'all 0.3s',
            '&:hover': {
              borderColor: 'primary.light',
              boxShadow: 2,
            }
          }}
          onClick={() => handleGaraSelection('running')}
        >
          <CardContent sx={{ textAlign: 'center' }}>
            <DirectionsRunIcon 
              sx={{ 
                fontSize: 60, 
                color: tipoGara === 'running' ? 'primary.main' : 'text.secondary',
                mb: 2 
              }} 
            />
            <Typography variant="h6" gutterBottom>
              Raduno running
            </Typography>
            <Typography variant="h4" color="primary" gutterBottom>
              €10
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Corri attraverso i sentieri di Beverino
            </Typography>
            {tipoGara === 'running' && (
              <CheckCircleIcon 
                sx={{ 
                  position: 'absolute', 
                  top: 10, 
                  right: 10, 
                  color: 'primary.main' 
                }} 
              />
            )}
          </CardContent>
        </Card>
      </Box>

      {errors.tipo_gara && (
        <FormHelperText error sx={{ mb: 2 }}>
          {typeof errors.tipo_gara?.message === 'string' ? errors.tipo_gara.message : null}
        </FormHelperText>
      )}

      {/* Sezione 2: Taglia maglietta - visibile solo se è stata scelta la gara */}
      {tipoGara && (
        <>
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            2. Taglia maglietta
          </Typography>
          
          <FormControl 
            fullWidth 
            error={!!errors.taglia_maglietta}
            sx={{ maxWidth: 400, mb: 4 }}
          >
            <InputLabel id="taglia-maglietta-label">Seleziona la taglia *</InputLabel>
            <Select
              labelId="taglia-maglietta-label"
              id="taglia-maglietta"
              value={selectedSize}
              label="Seleziona la taglia *"
              onChange={handleSizeChange}
            >
              <MenuItem value="XS">XS</MenuItem>
              <MenuItem value="S">S</MenuItem>
              <MenuItem value="M">M</MenuItem>
              <MenuItem value="L">L</MenuItem>
              <MenuItem value="XL">XL</MenuItem>
              <MenuItem value="XXL">XXL</MenuItem>
              <MenuItem value="XXXL">XXXL</MenuItem>
            </Select>
            {errors.taglia_maglietta && typeof errors.taglia_maglietta.message === 'string' && (
              <FormHelperText>{errors.taglia_maglietta.message}</FormHelperText>
            )}
          </FormControl>
        </>
      )}

      {/* Sezione 3: Pasta Party - visibile solo se è stata scelta la gara */}
      {tipoGara && (
        <>
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            3. Pasta Party (opzionale)
          </Typography>
          
          <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={pastaPartyEnabled}
                  onChange={handlePastaPartyToggle}
                  color="primary"
                />
              }
              label={
                <Typography>
                  Voglio partecipare al Pasta Party (€12 a persona)
                </Typography>
              }
            />
            
            {pastaPartyEnabled && (
              <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography>Numero partecipanti:</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton 
                    onClick={decrementPasta} 
                    disabled={pastaCount <= 1}
                    size="small"
                    color="primary"
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      minWidth: 40, 
                      textAlign: 'center',
                      px: 2,
                      py: 0.5,
                      bgcolor: 'grey.100',
                      borderRadius: 1
                    }}
                  >
                    {pastaCount}
                  </Typography>
                  <IconButton 
                    onClick={incrementPasta} 
                    disabled={pastaCount >= 20}
                    size="small"
                    color="primary"
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  (incluso l'iscritto)
                </Typography>
              </Box>
            )}
          </Paper>
        </>
      )}

      {/* Riepilogo prezzi - sempre visibile */}
      {tipoGara && (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 3, 
            bgcolor: 'primary.50',
            border: 1,
            borderColor: 'primary.200'
          }}
        >
          <Typography variant="h6" gutterBottom>
            Riepilogo
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography>
              {tipoGara === 'ciclistica' ? 'Raduno ciclistico' : 'Raduno running'}:
            </Typography>
            <Typography fontWeight="bold">€{prezzoGara}</Typography>
          </Box>
          
          {pastaPartyEnabled && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>
                Pasta Party ({pastaCount} {pastaCount === 1 ? 'persona' : 'persone'}):
              </Typography>
              <Typography fontWeight="bold">€{prezzoPastaParty}</Typography>
            </Box>
          )}
          
          <Divider sx={{ my: 2 }} />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">TOTALE:</Typography>
            <Typography variant="h6" color="primary" fontWeight="bold">
              €{prezzoTotale}
            </Typography>
          </Box>
        </Paper>
      )}
    </Box>
  );
}