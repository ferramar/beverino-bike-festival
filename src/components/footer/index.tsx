import React from 'react';
import { Box, Container, Grid, Link, Typography, IconButton, Stack } from '@mui/material';
import { Facebook, Instagram, Email, Phone } from '@mui/icons-material';
import { visuallyHidden } from '@mui/utils';
import { isRegistrationOpen } from '../../utils/isRegistrationOpen';


const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        backgroundColor: 'primary.dark',
        color: 'white',
        mt: 'auto'
      }}
    >
      <Typography
        variant="h2"
        component="h2"
        sx={visuallyHidden}
      >
        Informazioni generali
      </Typography>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Chi Siamo */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
              Chi Siamo
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Il Beverino Bike Festival è la festa per eccellenza per gli appassionati di ciclismo, che offre percorsi, eventi e incontri comunitari per ciclisti di tutti i livelli.
            </Typography>
          </Grid>

          {/* Link - layout 2x2 */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
              Link
            </Typography>
            <Grid container spacing={2}>
              <Grid size={6}>
                <Stack spacing={1}>
                  <Link href="/" color="inherit" sx={{
                    textDecoration: 'none',
                    opacity: 0.9,
                    '&:hover': { opacity: 1, textDecoration: 'underline' }
                  }}>
                    Home
                  </Link>
                  <Link href="/percorsi" color="inherit" sx={{
                    textDecoration: 'none',
                    opacity: 0.9,
                    '&:hover': { opacity: 1, textDecoration: 'underline' }
                  }}>
                    Percorsi
                  </Link>
                  {/* da decommentare */}
                  {/* <Link href="/programma" color="inherit" sx={{
                    textDecoration: 'none',
                    opacity: 0.9,
                    '&:hover': { opacity: 1, textDecoration: 'underline' }
                  }}>
                    Programma
                  </Link> */}
                  {/* <Link href="/convenzioni" color="inherit" sx={{
                    textDecoration: 'none',
                    opacity: 0.9,
                    '&:hover': { opacity: 1, textDecoration: 'underline' }
                  }}>
                    Convenzioni
                  </Link> */}
                  {/* <Link href="/lotteria" color="inherit" sx={{
                    textDecoration: 'none',
                    opacity: 0.9,
                    '&:hover': { opacity: 1, textDecoration: 'underline' }
                  }}>
                    Lotteria
                  </Link> */}
                </Stack>
              </Grid>
              <Grid size={6}>
                <Stack spacing={1}>
                  <Link href="/galleria" color="inherit" sx={{
                    textDecoration: 'none',
                    opacity: 0.9,
                    '&:hover': { opacity: 1, textDecoration: 'underline' }
                  }}>
                    Galleria
                  </Link>
                  <Link href="/sponsor" color="inherit" sx={{
                    textDecoration: 'none',
                    opacity: 0.9,
                    '&:hover': { opacity: 1, textDecoration: 'underline' }
                  }}>
                    Sponsor
                  </Link>
                  {/* da decommentare */}
                  {/* <Link href="/faq" color="inherit" sx={{
                    textDecoration: 'none',
                    opacity: 0.9,
                    '&:hover': { opacity: 1, textDecoration: 'underline' }
                  }}>
                    FAQ
                  </Link> */}
                  {isRegistrationOpen() && (
                    <Link href="/iscriviti" color="inherit" sx={{
                      textDecoration: 'none',
                      opacity: 0.9,
                      '&:hover': { opacity: 1, textDecoration: 'underline' }
                    }}>
                      Iscriviti
                    </Link>
                  )}
                </Stack>
              </Grid>
            </Grid>
          </Grid>

          {/* Contatti */}
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
              Contatti
            </Typography>
            <Stack spacing={1.5}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ fontSize: 20, opacity: 0.8 }} />
                <Link
                  href="mailto:info@beverinobikefestival.it"
                  color="inherit"
                  sx={{
                    textDecoration: 'none',
                    opacity: 0.9,
                    fontSize: '0.875rem',
                    '&:hover': { opacity: 1, textDecoration: 'underline' }
                  }}
                >
                  info@beverinobikefestival.it
                </Link>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ fontSize: 20, opacity: 0.8 }} />
                <Link
                  href="tel:+393498878043"
                  color="inherit"
                  sx={{
                    textDecoration: 'none',
                    opacity: 0.9,
                    fontSize: '0.875rem',
                    '&:hover': { opacity: 1, textDecoration: 'underline' }
                  }}
                >
                  Marco: <strong>+39 349 887 8043</strong>
                </Link>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ fontSize: 20, opacity: 0.8 }} />
                <Link
                  href="tel:+393355342717"
                  color="inherit"
                  sx={{
                    textDecoration: 'none',
                    opacity: 0.9,
                    fontSize: '0.875rem',
                    '&:hover': { opacity: 1, textDecoration: 'underline' }
                  }}
                >
                  Paolo: <strong>+39 335 534 2717</strong>
                </Link>
              </Box>
            </Stack>
          </Grid>

          {/* Social */}
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
              Seguici
            </Typography>
            <Box>
              <IconButton
                aria-label="Visita la nostra pagina Facebook"
                href="https://www.facebook.com/beverinobikefestival/?locale=it_IT"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                sx={{
                  width: "45px",
                  height: "45px",
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                <Facebook />
              </IconButton>
              <IconButton
                aria-label="Visita il nostro profilo Instagram"
                href="https://www.instagram.com/beverino_bike_festival/"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                sx={{
                  width: "45px",
                  height: "45px",
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                <Instagram />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        {/* Legal Links & Copyright */}
        <Box mt={6} pt={4} sx={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          {/* Legal Links */}
          <Stack 
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1, sm: 3 }}
            justifyContent="center"
            alignItems="center"
            sx={{ mb: 3 }}
          >
            <Link 
              href="https://www.iubenda.com/privacy-policy/20393244"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              sx={{ 
                textDecoration: 'none',
                opacity: 0.8,
                fontSize: '0.875rem',
                '&:hover': { 
                  opacity: 1, 
                  textDecoration: 'underline' 
                }
              }}
            >
              Privacy Policy
            </Link>
            
            <Typography 
              sx={{ 
                display: { xs: 'none', sm: 'block' },
                opacity: 0.5 
              }}
            >
              •
            </Typography>
            
            <Link 
              href="https://www.iubenda.com/privacy-policy/20393244/cookie-policy"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              sx={{ 
                textDecoration: 'none',
                opacity: 0.8,
                fontSize: '0.875rem',
                '&:hover': { 
                  opacity: 1, 
                  textDecoration: 'underline' 
                }
              }}
            >
              Cookie Policy
            </Link>
          </Stack>
          
          {/* Copyright */}
          <Typography variant="body2" sx={{ opacity: 0.8, textAlign: 'center' }}>
            © {new Date().getFullYear()} Beverino Bike Festival. Tutti i diritti riservati.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;