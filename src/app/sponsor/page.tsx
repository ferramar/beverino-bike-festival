'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  Skeleton,
  Link as MuiLink,
  alpha
} from '@mui/material';
import Image from 'next/image';
import StarIcon from '@mui/icons-material/Star';
import LanguageIcon from '@mui/icons-material/Language';
import FilterListIcon from '@mui/icons-material/FilterList';
import { getAllSponsorsWithCategories, getAllSponsorCategories } from '../../utils/api';
import { SponsorItem, CategoriaS } from '../../types/sponsor';
import theme from '../../theme';
import { normalizeUrl } from '@/hooks/normalizeUrl';

export default function SponsorsPage() {
  const [sponsors, setSponsors] = useState<SponsorItem[]>([]);
  const [categories, setCategories] = useState<CategoriaS[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Usa le funzioni API
        const [sponsorsData, categoriesData] = await Promise.all([
          getAllSponsorsWithCategories(),
          getAllSponsorCategories()
        ]);

        setSponsors(sponsorsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching sponsors:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filtra sponsor
  const filteredSponsors = selectedCategory === 'all'
    ? sponsors
    : sponsors.filter(sponsor =>
      sponsor.categorie_sponsors?.some((cat: CategoriaS) => cat.id.toString() === selectedCategory)
    );

  // Separa principali
  const principalSponsors = filteredSponsors.filter(s => s.principale);
  const normalSponsors = filteredSponsors.filter(s => !s.principale);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Skeleton variant="text" width={300} height={60} sx={{ mb: 4 }} />
        <Grid container spacing={3}>
          {[...Array(6)].map((_, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
              <Skeleton variant="rectangular" height={200} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Box sx={{ py: { xs: 6, md: 8 }, minHeight: '100vh', backgroundColor: '#fafafa' }}>
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
              mb: 2
            }}
          >
            I Nostri Sponsor
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ maxWidth: 700, mx: 'auto' }}
          >
            Un ringraziamento speciale a tutti i partner che rendono possibile il Beverino Bike Festival
          </Typography>
        </Box>

        {/* Filtri */}
        {categories.length > 0 && (
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <FilterListIcon color="action" />
              <ToggleButtonGroup
                value={selectedCategory}
                exclusive
                onChange={(_, newCategory) => {
                  if (newCategory !== null) {
                    setSelectedCategory(newCategory);
                  }
                }}
                size="small"
              >
                <ToggleButton value="all">
                  Tutte le categorie
                </ToggleButton>
                {categories.map(category => (
                  <ToggleButton key={category.id} value={category.id.toString()} sx={{
                    color: theme.palette.text.secondary,
                    lineHeight: "2.2"
                  }}>
                    {category.nome}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            </Stack>
          </Box>
        )}

        {/* Sponsor Principali */}
        {principalSponsors.length > 0 && (
          <Box sx={{ mb: 8 }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{
                mb: 4,
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1
              }}
            >
              <StarIcon sx={{ color: 'warning.main' }} />
              Sponsor Principali
              <StarIcon sx={{ color: 'warning.main' }} />
            </Typography>

            <Grid container spacing={4} justifyContent="center">
              {principalSponsors.map((sponsor) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={sponsor.id}>
                  <SponsorCard sponsor={sponsor} isPrincipal />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Altri Sponsor */}
        {normalSponsors.length > 0 && (
          <Box>
            {principalSponsors.length > 0 && (
              <Typography
                variant="h4"
                component="h2"
                sx={{ mb: 4, textAlign: 'center' }}
              >
                Altri Partner
              </Typography>
            )}

            <Grid container spacing={3}>
              {normalSponsors.map((sponsor) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={sponsor.id}>
                  <SponsorCard sponsor={sponsor} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Nessuno sponsor */}
        {filteredSponsors.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h5" color="text.secondary">
              Nessuno sponsor trovato per questa categoria
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}

// Card Component
function SponsorCard({ sponsor, isPrincipal = false }: { sponsor: SponsorItem; isPrincipal?: boolean }) {
  const [imageError, setImageError] = useState(false);

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        border: isPrincipal ? '3px solid' : '1px solid',
        borderColor: isPrincipal ? 'warning.main' : 'divider',
        backgroundColor: 'background.paper',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: isPrincipal ? '0 12px 40px rgba(255, 152, 0, 0.3)' : '0 8px 30px rgba(0,0,0,0.12)',
        }
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          height: isPrincipal ? 200 : 150,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          backgroundColor: 'grey.50',
          position: 'relative'
        }}
      >
        {isPrincipal && (
          <Chip
            icon={<StarIcon />}
            label="Main Sponsor"
            size="small"
            color="warning"
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              fontWeight: 600
            }}
          />
        )}

        {sponsor.logo && !imageError ? (
          <Image
            src={sponsor.logo}
            alt={sponsor.nome}
            width={isPrincipal ? 250 : 180}
            height={isPrincipal ? 150 : 100}
            style={{
              objectFit: 'contain',
              width: 'auto',
              height: 'auto',
              maxWidth: '100%',
              maxHeight: '100%'
            }}
            onError={() => setImageError(true)}
          />
        ) : (
          <Typography variant={isPrincipal ? "h4" : "h5"} color="text.disabled">
            {sponsor.nome}
          </Typography>
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant={isPrincipal ? "h5" : "h6"}
          component="h3"
          gutterBottom
          fontWeight={600}
        >
          {sponsor.nome}
        </Typography>

        {sponsor.descrizione && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, flexGrow: 1 }}
          >
            {sponsor.descrizione}
          </Typography>
        )}

        {sponsor.sito && (
          <MuiLink
            href={normalizeUrl(sponsor.sito)}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              textDecoration: 'none',
              color: 'primary.main',
              fontWeight: 500,
              mb: 1,
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            <LanguageIcon fontSize="small" />
            Visita il sito
          </MuiLink>
        )}

        {/* Categorie */}
        {sponsor.categorie_sponsors && sponsor.categorie_sponsors.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
            {sponsor.categorie_sponsors.map((cat: CategoriaS) => (
              <Chip
                key={cat.id}
                label={cat.nome}
                size="small"
                variant="outlined"
                color="primary"
              />
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}