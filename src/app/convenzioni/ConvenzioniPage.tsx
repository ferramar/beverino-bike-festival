// src/app/convenzioni/ConvenzioniPage.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Button,
  Divider,
  Grid,
  Skeleton,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  LocalOffer as OfferIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Language as WebIcon,
  AccessTime as TimeIcon,
  Email as EmailIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import Image from 'next/image';
import { getAllConvenzioni } from '@/utils/api';
import { ConvenzioneItem, CATEGORIE_CONVENZIONI } from '@/types/convenzioni';

export default function ConvenzioniPage() {
  const [convenzioni, setConvenzioni] = useState<ConvenzioneItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchConvenzioni();
  }, []);

  const fetchConvenzioni = async () => {
    try {
      console.log('Fetching convenzioni...');
      const data = await getAllConvenzioni();
      console.log('Convenzioni ricevute:', data);
      setConvenzioni(data);
    } catch (err) {
      console.error('Errore dettagliato:', err);
      setError(`Errore nel caricamento delle convenzioni: ${err instanceof Error ? err.message : 'Errore sconosciuto'}`);
    } finally {
      setLoading(false);
    }
  };

  // Filtra convenzioni per categoria
  const filteredConvenzioni = selectedCategory === 'all'
    ? convenzioni
    : convenzioni.filter(conv => conv.categoria === selectedCategory);

  // Ottieni categorie uniche dalle convenzioni
  const categoriePresenti = Array.from(new Set(convenzioni.map(c => c.categoria)));

  const handleCategoryChange = (event: React.MouseEvent<HTMLElement>, newCategory: string | null) => {
    if (newCategory !== null) {
      setSelectedCategory(newCategory);
    }
  };

  if (loading) {
    return (
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: '#fafafa', minHeight: '100vh' }}>
        <Container maxWidth="lg">
          <Skeleton variant="text" width={300} height={60} sx={{ mx: 'auto', mb: 2 }} />
          <Skeleton variant="text" width={500} height={30} sx={{ mx: 'auto', mb: 6 }} />
          <Stack spacing={4}>
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} variant="rectangular" height={280} sx={{ borderRadius: 2 }} />
            ))}
          </Stack>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: '#fafafa', minHeight: '100vh' }}>
        <Container maxWidth="lg">
          <Alert severity="error" sx={{ maxWidth: 600, mx: 'auto' }}>
            {error}
          </Alert>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: '#fafafa', minHeight: '100vh' }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 800,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              mb: 2,
              background: 'linear-gradient(135deg, #A52D0C 0%, #FB6616 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Convenzioni Esclusive
          </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary"
            sx={{ maxWidth: 700, mx: 'auto' }}
          >
            Approfitta delle offerte speciali riservate ai partecipanti del Beverino Bike Festival
          </Typography>
          
          {/* Chip informativo */}
          <Chip 
            icon={<OfferIcon />}
            label="Presenta la mail di conferma iscrizione per usufruire degli sconti"
            color="primary"
            sx={{ mt: 3, px: 2, py: 3, fontSize: '0.95rem' }}
          />
        </Box>

        {/* Filtri per categoria */}
        {categoriePresenti.length > 1 && (
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <FilterIcon color="action" />
              <ToggleButtonGroup
                value={selectedCategory}
                exclusive
                onChange={handleCategoryChange}
                size="small"
              >
                <ToggleButton value="all">
                  Tutte ({convenzioni.length})
                </ToggleButton>
                {categoriePresenti.map(categoria => {
                  const count = convenzioni.filter(c => c.categoria === categoria).length;
                  const catInfo = CATEGORIE_CONVENZIONI.find(c => c.value === categoria);
                  return (
                    <ToggleButton key={categoria} value={categoria}>
                      {catInfo?.label || categoria} ({count})
                    </ToggleButton>
                  );
                })}
              </ToggleButtonGroup>
            </Stack>
          </Box>
        )}

        {/* Cards Convenzioni */}
        {filteredConvenzioni.length === 0 ? (
          <Alert severity="info" sx={{ maxWidth: 600, mx: 'auto' }}>
            Nessuna convenzione disponibile al momento.
          </Alert>
        ) : (
          <Stack spacing={4}>
            {filteredConvenzioni.map((convenzione) => (
              <ConvenzioneCard key={convenzione.id} convenzione={convenzione} />
            ))}
          </Stack>
        )}

        {/* Footer informativo */}
        <Box 
          sx={{ 
            mt: 8, 
            p: 4, 
            backgroundColor: 'primary.50',
            borderRadius: 3,
            textAlign: 'center',
            border: '2px dashed',
            borderColor: 'primary.main',
          }}
        >
          <Typography variant="h6" gutterBottom fontWeight={600} color="primary.dark">
            Come utilizzare le convenzioni
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Per usufruire degli sconti, presenta la mail di conferma iscrizione al Beverino Bike Festival 
            presso le attività convenzionate. Gli sconti sono personali e non cedibili.
          </Typography>
          {/* Link iscrizioni rimosso quando chiuse */}
        </Box>
      </Container>
    </Box>
  );
}

// Componente Card separato per migliore organizzazione
function ConvenzioneCard({ convenzione }: { convenzione: ConvenzioneItem }) {
  const [imageError, setImageError] = useState(false);

  return (
    <Card
      elevation={0}
      sx={{
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
          borderColor: convenzione.colore,
        },
      }}
    >
      <Grid container>
        {/* Immagine/Logo */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box
            sx={{
              position: 'relative',
              height: { xs: 200, md: '100%' },
              minHeight: { md: 280 },
              backgroundColor: 'grey.100',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRight: { md: '1px solid' },
              borderRightColor: { md: 'divider' },
            }}
          >
            {convenzione.immagine && !imageError ? (
              <Image
                src={convenzione.immagine}
                alt={convenzione.nome}
                fill
                style={{
                  objectFit: 'cover',
                }}
                onError={() => setImageError(true)}
              />
            ) : (
              <Box
                sx={{
                  width: '60%',
                  height: '60%',
                  backgroundColor: 'grey.300',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h6" color="grey.600">
                  {convenzione.nome}
                </Typography>
              </Box>
            )}
            
            {/* Badge Sconto */}
            <Box
              sx={{
                position: 'absolute',
                top: 20,
                right: 20,
                backgroundColor: convenzione.colore,
                color: 'white',
                borderRadius: '50%',
                width: 80,
                height: 80,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}
            >
              <Typography variant="h4" fontWeight={800}>
                {convenzione.sconto}
              </Typography>
              <Typography variant="caption" fontWeight={600}>
                SCONTO
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Contenuto */}
        <Grid size={{ xs: 12, md: 8 }}>
          <CardContent sx={{ p: { xs: 3, md: 4 }, height: '100%' }}>
            <Stack spacing={2} height="100%">
              {/* Header */}
              <Box>
                <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap">
                  <Typography variant="h4" component="h2" fontWeight={700}>
                    {convenzione.nome}
                  </Typography>
                  <Chip 
                    label={CATEGORIE_CONVENZIONI.find(c => c.value === convenzione.categoria)?.label || convenzione.categoria} 
                    size="small"
                    sx={{ 
                      backgroundColor: convenzione.colore,
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                </Stack>
              </Box>

              {/* Descrizione */}
              <Box>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {convenzione.descrizione}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontStyle: 'italic',
                    color: 'primary.main',
                    fontWeight: 500,
                  }}
                >
                  {convenzione.dettagli}
                </Typography>
              </Box>

              <Divider />

              {/* Info Contatti */}
              <Grid container spacing={2}>
                {convenzione.indirizzo && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <LocationIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {convenzione.indirizzo}
                      </Typography>
                    </Stack>
                  </Grid>
                )}
                
                {convenzione.telefono && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <PhoneIcon fontSize="small" color="action" />
                      <Typography variant="body2">
                        {convenzione.telefono}
                      </Typography>
                    </Stack>
                  </Grid>
                )}
                
                {convenzione.email && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <EmailIcon fontSize="small" color="action" />
                      <Typography 
                        variant="body2"
                        component="a"
                        href={`mailto:${convenzione.email}`}
                        sx={{
                          color: 'primary.main',
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {convenzione.email}
                      </Typography>
                    </Stack>
                  </Grid>
                )}
                
                {convenzione.website && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <WebIcon fontSize="small" color="action" />
                      <Typography 
                        variant="body2"
                        component="a"
                        href={convenzione.website.startsWith('http') ? convenzione.website : `https://${convenzione.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          color: 'primary.main',
                          textDecoration: 'none',
                          '&:hover': {
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {convenzione.website}
                      </Typography>
                    </Stack>
                  </Grid>
                )}
                
                {convenzione.validita && (
                  <Grid size={{ xs: 12 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <TimeIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {convenzione.validita}
                      </Typography>
                    </Stack>
                  </Grid>
                )}
              </Grid>
            </Stack>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );
}