'use client';

import { Box, Container, Typography, Skeleton } from '@mui/material';
import Image from 'next/image';
import { useState } from 'react';
import { keyframes } from '@mui/system';
import { SponsorItem } from '../../../types/sponsor';
import { normalizeUrl } from '@/hooks/normalizeUrl';

// Animazione di scorrimento continuo
const scroll = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-33.333%);
  }
`;

interface SponsorsCarouselProps {
  sponsors: SponsorItem[];
  speed?: number; // velocità in secondi
}

export default function SponsorsCarousel({ sponsors, speed = 20 }: SponsorsCarouselProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Triplichiamo gli sponsor per un loop più fluido
  // e assicuriamoci di avere abbastanza elementi per riempire lo schermo
  const minSponsors = 10; // Minimo numero di sponsor per riempire lo schermo
  let sponsorsToShow = [...sponsors];

  // Se abbiamo pochi sponsor, ripetiamoli fino ad avere almeno minSponsors
  while (sponsorsToShow.length < minSponsors) {
    sponsorsToShow = [...sponsorsToShow, ...sponsors];
  }

  // Ora triplichiamo per il loop infinito
  const duplicatedSponsors = [...sponsorsToShow, ...sponsorsToShow, ...sponsorsToShow];

  // Se non ci sono sponsor, non mostrare nulla
  if (!sponsors || sponsors.length === 0) {
    return null;
  }

  return (
    <Box
      component="section"
      aria-label="I nostri sponsor"
      sx={{
        py: 10,
        backgroundColor: "#fff",
        background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
        position: 'relative',
        overflow: 'hidden',
        '&:before': {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '150%',
          height: '150%',
          background: 'radial-gradient(circle, rgba(255,107,107,0.05) 0%, transparent 70%)',
          transform: 'translate(-50%, -50%)',
        }
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant='h2'
          component="h2"
          fontWeight={700}
          color='text.primary'
          sx={{
            mb: 2,
            fontSize: { xs: '2rem', md: '3rem', lg: '3.5rem' },
            textAlign: "center"
          }}
        >
          I Nostri Partner
        </Typography>

        <Typography
          variant="h6"
          component={"p"}
          color="text.secondary"
          sx={{
            mb: 6,
            maxWidth: 600,
            mx: 'auto',
            textAlign: "center"
          }}
        >
          Grazie al supporto dei nostri sponsor, rendiamo possibile questo evento straordinario
        </Typography>
      </Container>

      {/* Carousel container */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          overflow: 'hidden',
          '&::before, &::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            width: 100,
            height: '100%',
            zIndex: 2,
            pointerEvents: 'none',
          },
          '&::before': {
            left: 0,
            background: 'linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
          },
          '&::after': {
            right: 0,
            background: 'linear-gradient(to left, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
          },
        }}
      >
        <Box
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            animation: `${scroll} ${speed}s linear infinite`,
            animationPlayState: isHovered ? 'paused' : 'running',
            '&:hover': {
              cursor: 'pointer',
            },
            // Assicuriamoci che gli elementi siano sempre allineati
            gap: 0,
            width: 'fit-content',
          }}
        >
          {duplicatedSponsors.map((sponsor, index) => (
            <SponsorLogo key={`${sponsor.id}-${index}`} sponsor={sponsor} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

// Componente per singolo logo
function SponsorLogo({ sponsor }: { sponsor: SponsorItem }) {
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    if (sponsor.sito) {
      window.open(normalizeUrl(sponsor.sito), '_blank', 'noopener,noreferrer');
    }
  };

  if (!sponsor.logo || imageError) {
    // Fallback se non c'è logo o errore di caricamento
    return (
      <Box
        sx={{
          mx: 4,
          px: 3,
          py: 2,
          minWidth: 180,
          maxWidth: 180,
          height: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'grey.100',
          borderRadius: 2,
          flexShrink: 0,
        }}
      >
        <Typography variant="h6" color="text.disabled" noWrap>
          {sponsor.nome}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      onClick={handleClick}
      sx={{
        mx: 4,
        minWidth: 180,
        maxWidth: 180,
        height: 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        flexShrink: 0,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'scale(1.05)',
          cursor: sponsor.sito ? 'pointer' : 'default',
        },
      }}
      role={sponsor.sito ? 'link' : 'img'}
      aria-label={sponsor.sito ? `Visita il sito di ${sponsor.nome}` : sponsor.nome}
      tabIndex={sponsor.sito ? 0 : -1}
      onKeyPress={(e) => {
        if (e.key === 'Enter' && sponsor.sito) {
          handleClick();
        }
      }}
    >
      <Image
        src={sponsor.logo}
        alt={sponsor.nome}
        width={150}
        height={80}
        style={{
          objectFit: 'contain',
          width: 'auto',
          height: 'auto',
          maxWidth: '150px',
          maxHeight: '80px',
        }}
        onError={() => setImageError(true)}
      />
    </Box>
  );
}

// Loading skeleton
export function SponsorsCarouselSkeleton() {
  return (
    <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Skeleton variant="text" width={300} height={40} sx={{ mx: 'auto', mb: 2 }} />
        <Skeleton variant="text" width={500} height={24} sx={{ mx: 'auto', mb: 6 }} />

        <Box sx={{ display: 'flex', gap: 4, overflow: 'hidden' }}>
          {[...Array(5)].map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              width={150}
              height={80}
              sx={{ borderRadius: 2, flexShrink: 0 }}
            />
          ))}
        </Box>
      </Container>
    </Box>
  );
}