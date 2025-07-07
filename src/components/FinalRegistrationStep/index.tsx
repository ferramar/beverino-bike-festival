import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  TextField,
  Divider,
  Chip,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormHelperText,
} from '@mui/material';
import {
  DirectionsBike,
  Restaurant,
  EuroSymbol,
  CheckroomOutlined,
} from '@mui/icons-material';
import { useFormContext } from 'react-hook-form';

const RACE_PRICE = 25;
const PASTA_PRICE = 15;

const TAGLIE = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] as const;

export default function FinalRegistrationStep() {
  const { watch, setValue, formState: { errors } } = useFormContext();
  const [option, setOption] = useState<'race-only' | 'race-pasta'>('race-only');
  const pastaCount = watch('conteggio_pastaparty', 1);
  const selectedSize = watch('taglia_maglietta', '');

  // Sincronizza il form con l'opzione selezionata
  useEffect(() => {
    if (option === 'race-only') {
      setValue('conteggio_pastaparty', 0);
    } else if (pastaCount === 0) {
      setValue('conteggio_pastaparty', 1);
    }
  }, [option, setValue, pastaCount]);

  const handleOptionChange = (newOption: 'race-only' | 'race-pasta') => {
    setOption(newOption);
  };

  const handlePastaCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(1, parseInt(e.target.value, 10) || 1);
    setValue('conteggio_pastaparty', value);
  };

  const handleSizeChange = (event: SelectChangeEvent) => {
    setValue('taglia_maglietta', event.target.value, { shouldValidate: true });
  };

  const racePrice = RACE_PRICE;
  const pastaPrice = option === 'race-pasta' ? pastaCount * PASTA_PRICE : 0;
  const totalPrice = racePrice + pastaPrice;

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 700, mx: 'auto' }}>
      <Box textAlign="center" sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight={600}>
          Scegli il tuo pacchetto
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Seleziona l'opzione che preferisci per completare l'iscrizione
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Opzione Solo Gara */}
        <Grid size={{xs: 12, sm: 6}}>
          <Card
            elevation={option === 'race-only' ? 8 : 2}
            sx={{
              height: "100%",
              position: 'relative',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: option === 'race-only' 
                ? '3px solid' 
                : '2px solid transparent',
              borderColor: option === 'race-only' 
                ? 'primary.dark' 
                : 'transparent',
              transform: option === 'race-only' ? 'scale(1.02)' : 'scale(1)',
              '&:hover': {
                transform: 'scale(1.02)',
                elevation: 6,
              }
            }}
          >
            <CardActionArea onClick={() => handleOptionChange('race-only')}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <DirectionsBike 
                  sx={{ 
                    fontSize: 48, 
                    color: 'primary.dark', 
                    mb: 2 
                  }} 
                />
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Solo Gara
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Partecipazione alla gara ciclistica
                </Typography>
                <Typography variant="h4" color="primary.dark" fontWeight={700}>
                  €{RACE_PRICE}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        {/* Opzione Gara + Pasta Party */}
        <Grid size={{xs: 12, sm: 6}}>
          <Card
            elevation={option === 'race-pasta' ? 8 : 2}
            sx={{
              position: 'relative',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              border: option === 'race-pasta' 
                ? '3px solid' 
                : '2px solid transparent',
              borderColor: option === 'race-pasta' 
                ? 'primary.dark' 
                : 'transparent',
              transform: option === 'race-pasta' ? 'scale(1.02)' : 'scale(1)',
              '&:hover': {
                transform: 'scale(1.02)',
                elevation: 6,
              }
            }}
          >
            <CardActionArea onClick={() => handleOptionChange('race-pasta')}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Stack direction="row" justifyContent="center" spacing={1} sx={{ mb: 2 }}>
                  <DirectionsBike sx={{ fontSize: 40, color: 'primary.dark' }} />
                  <Typography variant="h5" sx={{ mx: 1 }}>+</Typography>
                  <Restaurant sx={{ fontSize: 40, color: 'primary.dark' }} />
                </Stack>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  Gara + Pasta Party
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Gara + festa post-gara con pasta party
                </Typography>
                <Typography variant="h6" color="primary.dark" fontWeight={700}>
                  €{RACE_PRICE} + €{PASTA_PRICE}/persona
                </Typography>
                <Chip 
                  label="Più popolare" 
                  color="secondary" 
                  variant="outlined" 
                  size="small"
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Grid>

      {/* Selezione taglia maglietta */}
      <Box sx={{ mb: 4 }}>
        <Card
          elevation={4}
          sx={{
            border: '2px solid',
            borderColor: 'primary.main',
            bgcolor: 'primary.50',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <CheckroomOutlined sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" color="primary.main" fontWeight={600}>
                Taglia Maglietta Gara
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Ogni partecipante riceverà una maglietta tecnica del Beverino Bike Festival
            </Typography>
            
            <FormControl 
              fullWidth 
              required
              error={!!errors.taglia_maglietta}
            >
              <InputLabel id="taglia-maglietta-label">Seleziona la taglia</InputLabel>
              <Select
                labelId="taglia-maglietta-label"
                id="taglia-maglietta"
                value={selectedSize}
                label="Seleziona la taglia *"
                onChange={handleSizeChange}
              >
                {TAGLIE.map((taglia) => (
                  <MenuItem key={taglia} value={taglia}>
                    {taglia}
                  </MenuItem>
                ))}
              </Select>
              {errors.taglia_maglietta && (
                <FormHelperText error>
                  {typeof errors.taglia_maglietta.message === 'string'
                    ? errors.taglia_maglietta.message
                    : 'Seleziona una taglia'}
                </FormHelperText>
              )}
            </FormControl>
          </CardContent>
        </Card>
      </Box>

      {/* Input numero persone pasta party */}
      {option === 'race-pasta' && (
        <Box sx={{ mb: 4 }}>
          <Card
            elevation={4}
            sx={{
              border: '2px solid',
              borderColor: 'secondary.main',
              bgcolor: 'secondary.50',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom color="secondary.main" fontWeight={600}>
                Dettagli Pasta Party
              </Typography>
              
              <TextField
                label="Numero persone"
                type="number"
                value={pastaCount}
                onChange={handlePastaCountChange}
                inputProps={{ min: 1, max: 10 }}
                fullWidth
                helperText="Indica quante persone parteciperanno al pasta party"
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: 'secondary.main',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: 'secondary.main',
                  },
                }}
              />
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  bgcolor: 'background.paper',
                  p: 2,
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'secondary.light',
                }}
              >
                <Typography variant="body1" fontWeight={500}>
                  Costo pasta party: {pastaCount} × €{PASTA_PRICE}
                </Typography>
                <Typography variant="h6" color="secondary.main" fontWeight={700}>
                  €{pastaPrice}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Riepilogo totale */}
      <Card 
        variant="outlined" 
        sx={{ 
          p: 3, 
          bgcolor: 'grey.50',
          border: '2px solid',
          borderColor: 'primary.dark'
        }}
      >
        <Typography variant="h6" gutterBottom>
          Riepilogo ordine
        </Typography>
        
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography>Gara ciclistica</Typography>
            <Typography>€{racePrice}</Typography>
          </Box>
          
          {selectedSize && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Maglietta taglia {selectedSize}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                inclusa
              </Typography>
            </Box>
          )}
          
          {option === 'race-pasta' && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography>Pasta Party ({pastaCount} {pastaCount === 1 ? 'persona' : 'persone'})</Typography>
              <Typography>€{pastaPrice}</Typography>
            </Box>
          )}
          
          <Divider />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" fontWeight={700}>
              Totale
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EuroSymbol sx={{ mr: 0.5, color: 'primary.dark' }} />
              <Typography variant="h4" color="primary.dark" fontWeight={700}>
                {totalPrice}
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Card>
    </Box>
  );
}