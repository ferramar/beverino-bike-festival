import React from 'react';
import { Box, Container, Grid, Link, Typography, IconButton } from '@mui/material';
import { Facebook, Instagram } from '@mui/icons-material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        backgroundColor: 'primary.dark',
        color: 'white',
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid size={{xs: 12, sm: 4}}>
            <Typography variant="h6" component={"h3"} gutterBottom>
              Chi Siamo
            </Typography>
            <Typography variant="body2">
            Il Beverino Bike Festival è la festa per eccellenza per gli appassionati di ciclismo, che offre percorsi, eventi e incontri comunitari per ciclisti di tutti i livelli.
            </Typography>
          </Grid>
          <Grid size={{xs: 12, sm: 4}} sx={{
            "& > a": {
              "&:hover": {
                textDecoration: "none"
              }
            }
          }}>
            <Typography variant="h6" component={"h3"} gutterBottom>
              Link 
            </Typography>
            <Link href="/" color="inherit" display="block" lineHeight={"3"}>
              Home
            </Link>
            <Link href="/programma" color="inherit" display="block" lineHeight={"3"}>
              Programma
            </Link>
            <Link href="/galleria" color="inherit" display="block" lineHeight={"3"}>
              Galleria
            </Link>
            <Link href="/sponsor" color="inherit" display="block" lineHeight={"3"}>
              Sponsor
            </Link>
            <Link href="/faq" color="inherit" display="block" lineHeight={"3"}>
              FAQ
            </Link>
          </Grid>
          <Grid size={{xs: 12, sm: 4}}>
            <Typography variant="h6" component={"h3"} gutterBottom>
              Seguici
            </Typography>
            <Box>
              <IconButton
                aria-label="Facebook"
                href="https://facebook.com"
                color="inherit"
                sx={{width: "45px", height: "45px"}}
              >
                <Facebook />
              </IconButton>
              <IconButton
                aria-label="Instagram"
                href="https://instagram.com"
                color="inherit"
                sx={{width: "45px", height: "45px"}}
              >
                <Instagram />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        <Box mt={4} textAlign="center">
          <Typography variant="body2">
            © {new Date().getFullYear()} Beverino Bike Festival. All rights
            reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;