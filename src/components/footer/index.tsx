"use client"
import React from 'react';
import { Box, Container, Grid, Link, Typography, IconButton, Stack } from '@mui/material';
import { Facebook, Instagram, Email, Phone } from '@mui/icons-material';
import { visuallyHidden } from '@mui/utils';
import { isRegistrationOpen } from '../../utils/isRegistrationOpen';

const bottomLinkSx = {
  textDecoration: 'none',
  fontSize: 'inherit',
  opacity: 0.7,
  transition: 'opacity 0.2s',
  '&:hover': { opacity: 1, textDecoration: 'underline' },
} as const;

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

        {/* Copyright, link legali e credito */}
        <Box
          sx={{
            mt: 6,
            pt: 3,
            borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'center', md: 'center' },
            justifyContent: 'space-between',
            gap: { xs: 1.5, md: 3 },
            fontSize: '0.8125rem',
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: { xs: 'center', md: 'flex-start' },
              columnGap: 2,
              rowGap: 0.5,
            }}
          >
            <Typography component="p" sx={{ fontSize: 'inherit', opacity: 0.7, m: 0 }}>
              © {new Date().getFullYear()} Beverino Bike Festival. Tutti i diritti riservati.
            </Typography>
            <Box component="nav" aria-label="Note legali" sx={{ display: 'flex', columnGap: 2 }}>
              <Link
                href="https://www.iubenda.com/privacy-policy/20393244"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                sx={bottomLinkSx}
              >
                Privacy Policy
              </Link>
              <Link
                href="https://www.iubenda.com/privacy-policy/20393244/cookie-policy"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                sx={bottomLinkSx}
              >
                Cookie Policy
              </Link>
            </Box>
          </Box>

          <Link
            href="https://lorenzocadente.dev"
            target="_blank"
            rel="noopener"
            color="inherit"
            sx={{
              ...bottomLinkSx,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            Realizzato da
            <Box
              component="svg"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="32 30 192 196"
              fill="currentColor"
              aria-hidden="true"
              focusable="false"
              sx={{ height: 14, width: 'auto', flexShrink: 0 }}
            >
              <path d="M35 32h22l-0.003 10.945c0 11.983 0.034 23.964 0.083 35.946 0.03 7.26 0.048 14.519 0.04 21.778q-0.01 9.502 0.046 19.004 0.032 5.02 0.014 10.041C57.117 149.188 58.335 164.334 71 180l1.273 1.727c5.192 6.794 12.196 10.696 19.665 14.523l1.987 1.035c8.577 4.255 16.9 5.014 26.378 5.034l3.314 0.03c3.587 0.031 7.175 0.048 10.762 0.065q3.747 0.028 7.495 0.059 8.828 0.068 17.657 0.116c7.365 0.043 14.73 0.098 22.096 0.153 13.124 0.097 26.249 0.18 39.373 0.258v21c-14.474 0.068 -28.949 0.123 -43.423 0.155q-10.083 0.022 -20.167 0.071 -9.745 0.048 -19.49 0.059 -3.704 0.008 -7.407 0.032c-28.263 0.18 -50.39 -4.1 -71.513 -24.317l-1.934 -1.742C45.946 187.905 39.966 173.35 36 159l-0.542 -1.858c-0.531 -2.485 -0.58 -4.751 -0.578 -7.293l-0.004 -3.152 0.01 -3.442v-3.637q0.001 -4.93 0.013 -9.86c0.006 -3.437 0.006 -6.874 0.008 -10.31q0.005 -9.76 0.021 -19.518 0.016 -11.112 0.022 -22.222Q34.966 54.854 35 32" />
              <path d="m167.973 31.805 4.602 0.008q6.015 0.014 12.029 0.05c4.103 0.02 8.205 0.03 12.308 0.04 8.03 0.02 16.059 0.056 24.088 0.097v21l-5.96 0.012q-9.813 0.032 -19.625 0.12c-3.962 0.034 -7.923 0.06 -11.884 0.064 -3.833 0.004 -7.664 0.033 -11.496 0.077q-2.18 0.02 -4.358 0.013c-13.356 -0.032 -23.722 2.807 -33.482 12.253 -8.436 9.457 -10.503 18.989 -10.53 31.32l-0.021 3.108q-0.015 3.243 -0.015 6.485c-0.004 3.274 -0.04 6.547 -0.078 9.821 -0.079 14.512 0.523 27.197 10.449 38.727 2.496 2.36 5.021 4.292 8 6l1.636 0.989c7.502 3.968 15.295 3.616 23.555 3.62q2.336 0.023 4.67 0.05c4.069 0.044 8.137 0.064 12.206 0.08 4.164 0.019 8.327 0.06 12.49 0.1 8.147 0.076 16.295 0.124 24.443 0.161v21c-9.067 0.068 -18.134 0.123 -27.202 0.155q-6.316 0.022 -12.634 0.071 -6.108 0.048 -12.215 0.059a662 662 0 0 0 -4.637 0.032c-17.476 0.177 -32.206 -3.729 -45.148 -16.013 -19.894 -19.725 -18.19 -46.408 -18.351 -72.491l-0.04 -3.324c-0.012 -10.418 0.854 -20.297 5.79 -29.614l1.062 -2.053C115.263 49.661 127.968 39.47 143 34c8.286 -2.376 16.429 -2.257 24.973 -2.195" />
            </Box>
            Lorenzo Cadente
            <Box component="span" sx={visuallyHidden}>(si apre in una nuova scheda)</Box>
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;