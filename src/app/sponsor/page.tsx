'use client';
import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  Fade,
  useTheme,
  useMediaQuery,
  Link as MuiLink,
} from '@mui/material';
import {
  Business,
  Launch,
} from '@mui/icons-material';
import Link from 'next/link';
import Image from 'next/image';
import useSWR from 'swr';
import { getAllSponsors } from '../../utils/api';
import { SponsorItem } from '../../utils/types';

// Usa il tipo SponsorItem dai tuoi utils/types

const SponsorCard = ({ sponsor, delay = 0 }: { sponsor: SponsorItem; delay?: number }) => {
  return (
    <Fade in timeout={600 + delay}>
      <Card
        elevation={1}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(0)',
            boxShadow: `0 12px 24px rgba(191, 54, 12, 0.15)`,
            borderColor: '#BF360C',
          },
          border: `2px solid transparent`,
        }}
      >
        {/* Logo sponsor */}
        <Box
          sx={{
            position: 'relative',
            height: 200,
            bgcolor: '#f5f5f5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {sponsor.logo ? (
            <Image
              src={sponsor.logo}
              alt={sponsor.nome || 'Logo sponsor'}
              fill
              style={{
                objectFit: 'contain',
                padding: '20px',
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <Business sx={{ fontSize: 80, color: '#ddd' }} />
          )}
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            {sponsor.nome || 'Nome non disponibile'}
          </Typography>
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 3,
              lineHeight: 1.6,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {sponsor.descrizione || 'Descrizione non disponibile'}
          </Typography>

          {sponsor.sito && (
            <Button
              component={MuiLink}
              href={sponsor.sito}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              startIcon={<Launch />}
              fullWidth
              sx={{
                backgroundColor: '#BF360C',
                '&:hover': {
                  backgroundColor: '#D32F2F',
                },
                mt: 'auto',
              }}
            >
              Visita il sito
            </Button>
          )}
        </CardContent>
      </Card>
    </Fade>
  );
};

const SponsorList = ({ sponsors }: { sponsors: SponsorItem[] }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box textAlign="center" sx={{ mb: 8 }}>
        <Typography variant="h2" component="h1" gutterBottom fontWeight={700}>
          I Nostri Sponsor
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
          Grazie a tutti i partner che rendono possibile il Beverino Bike Festival. 
          Il loro supporto è fondamentale per creare un evento indimenticabile.
        </Typography>

        {/* Statistiche */}
        <Grid container spacing={3} sx={{ maxWidth: 400, mx: 'auto' }}>
          <Grid size={{ xs: 6 }}>
            <Box textAlign="center">
              <Typography variant="h3" fontWeight={700} color="#BF360C">
                {sponsors.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Partner
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Box textAlign="center">
              <Typography variant="h3" fontWeight={700} color="#BF360C">
                100%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Locali
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Grid sponsor - tutti uguali */}
      <Grid container spacing={3} sx={{ mb: 8 }}>
        {sponsors.map((sponsor, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={sponsor.id}>
            <SponsorCard sponsor={sponsor} delay={index * 100} />
          </Grid>
        ))}
      </Grid>

      {/* Call to Action */}
      <Box
        sx={{
          p: 6,
          textAlign: 'center',
          bgcolor: '#f8f9fa',
          borderRadius: 3,
          border: '2px solid #BF360C',
        }}
      >
        <Typography variant="h5" gutterBottom fontWeight={600}>
          Vuoi diventare sponsor?
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
          Unisciti a noi e supporta il Beverino Bike Festival! Contattaci per scoprire 
          le opportunità di partnership e i pacchetti sponsorship disponibili.
        </Typography>
        <Button
          component={Link}
          href="/contatti"
          variant="contained"
          size="large"
          sx={{
            backgroundColor: '#BF360C',
            px: 4,
            py: 1.5,
            '&:hover': {
              backgroundColor: '#D32F2F',
            },
          }}
        >
          Contattaci
        </Button>
      </Box>
    </Container>
  );
};

const LoadingSkeleton = () => (
  <Container maxWidth="lg">
    <Box textAlign="center" sx={{ mb: 8 }}>
      <Box sx={{ height: 60, bgcolor: '#f0f0f0', mb: 2, borderRadius: 1, mx: 'auto', maxWidth: 400 }} />
      <Box sx={{ height: 40, bgcolor: '#f0f0f0', mb: 4, borderRadius: 1, mx: 'auto', maxWidth: 600 }} />
    </Box>
    
    <Grid container spacing={3}>
      {[1, 2, 3, 4].map((i) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
          <Card sx={{ height: 400 }}>
            <Box sx={{ height: 200, bgcolor: '#f0f0f0' }} />
            <CardContent>
              <Box sx={{ height: 20, bgcolor: '#f0f0f0', mb: 2, borderRadius: 1 }} />
              <Box sx={{ height: 60, bgcolor: '#f0f0f0', mb: 2, borderRadius: 1 }} />
              <Box sx={{ height: 36, bgcolor: '#f0f0f0', borderRadius: 1 }} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Container>
);

export default function Sponsor() {
  const { data, error } = useSWR('/api/sponsors', getAllSponsors);

  if (error) {
    return (
      <Box component="main" sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Box textAlign="center" sx={{ py: 8 }}>
            <Typography variant="h5" color="error" gutterBottom>
              Errore nel caricamento degli sponsor
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Si è verificato un problema. Riprova più tardi.
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box component="main" sx={{ py: 8 }}>
        <LoadingSkeleton />
      </Box>
    );
  }

  return (
    <Box component="main" sx={{ py: 8 }}>
      {data?.length ? (
        <SponsorList sponsors={data} />
      ) : (
        <Container maxWidth="lg">
          <Box textAlign="center" sx={{ py: 8 }}>
            <Typography variant="h5" gutterBottom>
              Nessuno sponsor trovato
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Al momento non ci sono sponsor da visualizzare.
            </Typography>
          </Box>
        </Container>
      )}
    </Box>
  );
}