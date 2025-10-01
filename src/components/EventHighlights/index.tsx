import { Box, Container, Grid, Typography, Button } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const highlights = [
  {
    image: '/percorso-1.jpg',
    title: 'Il Percorso',
    description: 'Scopri i dettagli dei tre percorsi attraverso le colline liguri, con mappe interattive e profili altimetrici.',
    link: '/percorsi',
    linkText: 'Esplora i percorsi'
  },
  // {
  //   image: '/festa.jpg',
  //   title: 'Il Festival',
  //   description: 'Non solo gara: musica, cibo locale, stand espositivi e attività per tutta la famiglia nel cuore di Beverino.',
  //   link: '/programma',
  //   linkText: 'Scopri il programma'
  // }, // Pausa - evento passato
  {
    image: '/sponsor.jpg',
    title: 'I Partner',
    description: 'L\'evento è reso possibile grazie al supporto di aziende locali e nazionali che condividono la nostra passione.',
    link: '/sponsor',
    linkText: 'Diventa sponsor'
  }
];

export default function EventHighlights() {
  return (
    <Box sx={{ 
      py: 10, 
      backgroundColor: '#f5f5f5'
    }}>
      <Container maxWidth="lg">
        <Box textAlign="center" sx={{ mb: 8 }}>
          <Typography
            variant="h2"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 700, mb: 2 }}
          >
            Più di una Semplice Gara
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ maxWidth: 700, mx: 'auto' }}
          >
            Un weekend all'insegna dello sport, del divertimento e della scoperta del territorio
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {highlights.map((item, index) => (
            <Grid size={{xs: 12, md: 4}} key={index}>
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  overflow: 'hidden',
                  backgroundColor: 'white',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    '& .image': {
                      transform: 'scale(1.05)',
                    },
                    '& .arrow': {
                      transform: 'translateX(5px)',
                    }
                  }
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    height: 250,
                    overflow: 'hidden',
                    backgroundColor: 'grey.200',
                  }}
                >
                  <Box
                    className="image"
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    {/* Placeholder per l'immagine */}
                    <Box sx={{
                      width: '100%',
                      height: '100%',
                      background: `linear-gradient(135deg, ${['#FF6B6B', '#4ECDC4', '#45B7D1'][index]} 0%, ${['#ee5a6f', '#3ebdb6', '#3fa0c4'][index]} 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Typography variant="h3" sx={{ color: 'white', opacity: 0.3 }}>
                        {index + 1}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ p: 4, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="h4" component="h3" gutterBottom fontWeight={600}>
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 3, flexGrow: 1 }}
                  >
                    {item.description}
                  </Typography>
                  <Button
                    component={Link}
                    href={item.link}
                    endIcon={<ArrowForwardIcon className="arrow" sx={{ transition: 'transform 0.3s ease' }} />}
                    sx={{
                      alignSelf: 'flex-start',
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 600,
                    }}
                  >
                    {item.linkText}
                  </Button>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* CTA Finale */}
        <Box sx={{ 
          mt: 8, 
          textAlign: 'center',
          p: 6,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        }}>
          <Typography variant="h4" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
            Pronto a vivere l'avventura?
          </Typography>
          <Typography variant="h6" sx={{ color: 'white', mb: 4, opacity: 0.9 }}>
            Le iscrizioni sono aperte. Assicurati il tuo posto!
          </Typography>
          <Button
            component={Link}
            href="/iscriviti"
            variant="contained"
            size="large"
            sx={{
              backgroundColor: 'white',
              color: 'primary.main',
              px: 4,
              py: 1.5,
              fontSize: '1.125rem',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'grey.100',
              }
            }}
          >
            Iscriviti Ora
          </Button>
        </Box>
      </Container>
    </Box>
  );
}