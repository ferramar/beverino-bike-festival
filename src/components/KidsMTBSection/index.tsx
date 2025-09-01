"use client"
import { Box, Container, Typography, Button, Grid, Card, CardContent, Alert } from '@mui/material';
import {
  DirectionsBike,
  Download,
  AccessTime,
  Groups,
  CheckCircle,
  School
} from '@mui/icons-material';

export default function KidsMTBSection() {
  const handleDownload = () => {
    // Scarica la liberatoria vuota
    const link = document.createElement('a');
    link.href = '/liberatoria-beverino-bike-festival.pdf';
    link.download = 'liberatoria-beverino-bike-festival.pdf';
    link.click();
  };

  return (
    <Box sx={{
      py: 10,
      background: 'linear-gradient(135deg, #FFF5ED 0%, #FFEBD5 100%)',
      position: 'relative',
      overflow: 'hidden',
      '&:before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url("/pattern-kids.svg")',
        backgroundRepeat: 'repeat',
        opacity: 0.05,
      }
    }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            component="h2"
            fontWeight={800}
            sx={{
              fontSize: { xs: '2rem', md: '3rem', lg: '3.5rem' },
              mb: 2,
              background: 'linear-gradient(135deg, #A52D0C 0%, #FB6616 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Corso MTB per Bambini
          </Typography>

          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ maxWidth: 700, mx: 'auto', mb: 3 }}
          >
            Un'esperienza indimenticabile per i più piccoli!
          </Typography>
        </Box>

        <Grid container spacing={4} alignItems="center">
          {/* Colonna sinistra - Info */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ pr: { md: 4 } }}>
              <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
                Un'opportunità unica per imparare
              </Typography>

              <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                Durante il Beverino Bike Festival, i bambini potranno partecipare
                gratuitamente a un corso di mountain bike tenuto da istruttori qualificati.
                Un modo divertente e sicuro per avvicinarsi a questo sport!
              </Typography>

              {/* Caratteristiche */}
              <Box sx={{ mt: 4 }}>
                {[
                  { icon: <Groups />, text: "Età: 6-14 anni" },
                  { icon: <AccessTime />, text: "Durata: 2 ore circa" },
                ].map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: 2,
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'white',
                        transform: 'translateX(10px)',
                      }
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: 'primary.main',
                        color: 'white',
                        flexShrink: 0,
                        mr: 2,
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Typography 
                      variant="body1"
                      fontWeight={500} 
                      dangerouslySetInnerHTML={{ __html: item.text }}
                      sx={{
                        '& a': {
                          color: 'primary.main',
                          textDecoration: 'underline',
                          '&:hover': {
                            textDecoration: 'none',
                          }
                        }
                      }}
                    ></Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Colonna destra - Card iscrizione */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card
              elevation={8}
              sx={{
                p: 4,
                borderRadius: 3,
                background: 'white',
                position: 'relative',
                overflow: 'visible',
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: -5,
                  left: -5,
                  right: -5,
                  bottom: -5,
                  background: 'linear-gradient(135deg, #A52D0C 0%, #FB6616 100%)',
                  borderRadius: 3,
                  zIndex: -1,
                }
              }}
            >
              <CardContent>
                <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                  Come Iscriversi
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle color="success" />
                    È semplicissimo!
                  </Typography>
                </Box>

                <Box
                  component="ol"
                  sx={{
                    pl: 3,
                    '& li': {
                      mb: 2,
                      fontSize: '1rem',
                      lineHeight: 1.6,
                    }
                  }}
                >
                  <li>Scarica la liberatoria cliccando sul pulsante qui sotto</li>
                  <li>Compila tutti i campi richiesti</li>
                  <li>Porta la liberatoria firmata il giorno dell'evento</li>
                </Box>

                <Alert severity="info" sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{
                    "& a": {
                      textDecoration: 'underline',
                    }
                  }}>
                    <strong>Orario corso:</strong> 10:00 - 12:00<br />
                    <strong>Punto di ritrovo:</strong>  <a href="https://www.google.com/maps/place/Centro+polivalente/@44.1889504,9.7845131,820m/data=!3m2!1e3!4b1!4m6!3m5!1s0x12d4e500267e88d5:0xb3caafcdd521e82c!8m2!3d44.1889504!4d9.787088!16s%2Fg%2F11whhkcj68?entry=ttu&g_ep=EgoyMDI1MDcxNi4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer">Centro polivalente Beverino</a>
                  </Typography>
                </Alert>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={<Download />}
                  onClick={() => handleDownload()}
                  sx={{
                    py: 2,
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    backgroundColor: '#A52D0C',
                    boxShadow: '0 4px 15px rgba(165, 45, 12, 0.3)',
                    '&:hover': {
                      backgroundColor: '#8A2C12',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(165, 45, 12, 0.4)',
                    }
                  }}
                >
                  Scarica la Liberatoria
                </Button>

                <Typography variant="caption" display="block" textAlign="center" sx={{ mt: 2 }}>
                  La liberatoria deve essere firmata da un genitore o tutore legale
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Info aggiuntive */}
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Cosa impareranno i bambini?
          </Typography>

          <Grid container spacing={3} sx={{ mt: 3 }}>
            {[
              { title: "Tecnica di base", desc: "Posizione corretta, equilibrio e controllo della bici" },
              { title: "Sicurezza", desc: "Regole fondamentali e comportamento sicuro in bici" },
              { title: "Divertimento", desc: "Giochi ed esercizi per imparare divertendosi" },
              { title: "Percorso facile", desc: "Prova su un mini-percorso adatto ai principianti" },
            ].map((item, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    backgroundColor: 'white',
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    }
                  }}
                >
                  <Typography variant="h6" fontWeight={600} gutterBottom color="primary.main">
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}