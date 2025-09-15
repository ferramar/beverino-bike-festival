import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link,
} from '@mui/material';
import {
  QrCode as QrCodeIcon,
  Groups as GroupsIcon,
  CardGiftcard as GiftIcon,
  Email as EmailIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { Metadata } from 'next';

// Metadati SEO per la pagina lotteria
export const metadata: Metadata = {
  title: 'Lotteria Pedala & Vinci - Beverino Bike Festival 2025',
  description: 'Partecipa alla lotteria del Beverino Bike Festival! Iscriviti alla community Bici in Comune e vinci un Pacco Gara Speciale. Estrazione durante il Pasta Party del 21 settembre 2025.',
  keywords: 'lotteria, concorso, bici in comune, beverino bike festival, premio, pacco gara, mountain bike, ciclismo',
  openGraph: {
    title: 'Lotteria Pedala & Vinci - Beverino Bike Festival 2025',
    description: 'Partecipa alla lotteria del Beverino Bike Festival! Iscriviti alla community Bici in Comune e vinci un Pacco Gara Speciale.',
    type: 'website',
    locale: 'it_IT',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lotteria Pedala & Vinci - Beverino Bike Festival 2025',
    description: 'Partecipa alla lotteria del Beverino Bike Festival! Iscriviti alla community Bici in Comune e vinci un Pacco Gara Speciale.',
  },
  alternates: {
    canonical: '/lotteria',
  },
};

const LotteriaPage: React.FC = () => {
  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        backgroundColor: 'white',
        py: { xs: 4, sm: 6 },
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box 
          component="header" 
          sx={{ textAlign: 'center', mb: { xs: 4, sm: 6 } }}
        >
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 800,
              color: 'primary.main',
              mb: 2,
              fontSize: { xs: '2rem', sm: '3rem', md: '3.5rem' },
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            🎉 Lotteria "Pedala & Vinci"
          </Typography>
          
          <Typography
            variant="h5"
            component="p"
            sx={{
              color: 'text.secondary',
              maxWidth: '800px',
              mx: 'auto',
              lineHeight: 1.6,
              fontSize: { xs: '1.1rem', sm: '1.3rem' },
            }}
          >
            Entra nella community Bici in Comune e partecipa alla lotteria del Beverino Bike Festival!
          </Typography>
        </Box>

        {/* Main Content */}
        <Box component="section" sx={{ maxWidth: '800px', mx: 'auto' }}>
          {/* How it works section */}
          <Card
            sx={{
              backgroundColor: 'white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              borderRadius: 2,
              mb: 4,
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Typography
                variant="h4"
                component="h2"
                id="come-funziona"
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  mb: 4,
                  textAlign: 'center',
                }}
              >
                Come funziona
              </Typography>

              <Stack spacing={3}>
                <Box
                  sx={{
                    p: 3,
                    border: '2px solid',
                    borderColor: 'primary.main',
                    borderRadius: 2,
                    backgroundColor: 'rgba(165, 45, 12, 0.05)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: 'primary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <GroupsIcon />
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: 'primary.main' }}
                    >
                      1. Iscriviti alla community
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    Unisciti alla community <strong>Bici in Comune</strong> cliccando sul link qui sotto:
                  </Typography>
                  <Box sx={{ textAlign: 'center' }}>
                    <Link
                      href="https://www.sportesalute.eu/form-beverino"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Iscriviti alla community Bici in Comune (si apre in una nuova finestra)"
                      sx={{
                        display: 'inline-block',
                        backgroundColor: 'primary.main',
                        color: 'white',
                        px: 3,
                        py: 1.5,
                        borderRadius: 2,
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: '1rem',
                        '&:hover': {
                          backgroundColor: 'primary.dark',
                          transform: 'translateY(-1px)',
                          boxShadow: '0 4px 12px rgba(165, 45, 12, 0.3)',
                        },
                        '&:focus': {
                          outline: '2px solid',
                          outlineColor: 'primary.dark',
                          outlineOffset: '2px',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      Iscriviti a Bici in Comune
                    </Link>
                  </Box>
                </Box>

                <Box
                  sx={{
                    p: 3,
                    border: '2px solid',
                    borderColor: 'primary.main',
                    borderRadius: 2,
                    backgroundColor: 'rgba(165, 45, 12, 0.05)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: 'primary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <QrCodeIcon />
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: 'primary.main' }}
                    >
                      2. (Alternativa) QR code all'evento
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="text.secondary">
                    Se non ti sei ancora iscritto online, puoi farlo anche il <strong>21 settembre 2025</strong> durante il Festival scansionando il QR code presente all'evento
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 3,
                    border: '2px solid',
                    borderColor: 'primary.main',
                    borderRadius: 2,
                    backgroundColor: 'rgba(165, 45, 12, 0.05)',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: 'primary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <GiftIcon />
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, color: 'primary.main' }}
                    >
                      3. Partecipa automaticamente alla lotteria
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="text.secondary">
                    All'estrazione di un <strong>Pacco Gara Speciale</strong>, ricco di eccellenze del territorio
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Extraction info */}
          <Card
            sx={{
              backgroundColor: 'white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              borderRadius: 2,
              mb: 4,
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Typography
                variant="h4"
                component="h2"
                id="estrazione"
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  mb: 3,
                  textAlign: 'center',
                }}
              >
                Estrazione
              </Typography>
              
              <Box sx={{ mb: 3, textAlign: 'center' }}>
                <Chip
                  label="📌 Durante il Pasta Party del Festival"
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '1rem',
                    py: 2,
                    px: 3,
                  }}
                />
              </Box>

              <Typography variant="h6" color="text.primary" sx={{ mb: 2, fontWeight: 600 }}>
                Per ritirare il premio:
              </Typography>
              
              <List>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <EmailIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Mostra la mail di registrazione alla community Bici in Comune"
                    primaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Se presente: ritiro immediato"
                    primaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CheckCircleIcon color="info" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Se assente: contatto per consegna"
                    primaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card
            sx={{
              backgroundColor: 'white',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              borderRadius: 2,
              mb: 4,
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Typography
                variant="h4"
                component="h2"
                id="note"
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  mb: 3,
                  textAlign: 'center',
                }}
              >
                Note
              </Typography>
              
              <List>
                <ListItem sx={{ px: 0, alignItems: 'flex-start' }}>
                  <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Ogni partecipante può iscriversi una sola volta"
                    primaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0, alignItems: 'flex-start' }}>
                  <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="I dati raccolti saranno utilizzati esclusivamente per la gestione della lotteria e le comunicazioni legate alla community"
                    primaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0, alignItems: 'flex-start' }}>
                  <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                    <CheckCircleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="La mattina dell'evento è necessario confermare la propria iscrizione mostrando la mail di registrazione a Bici in Comune prima della partenza al desk dedicato."
                    primaryTypographyProps={{ variant: 'body1' }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Box>

        {/* Call to Action */}
        <Box 
          component="section" 
          sx={{ textAlign: 'center', mt: { xs: 4, sm: 6 }, maxWidth: '800px', mx: 'auto' }}
        >
          <Paper
            elevation={4}
            sx={{
              p: { xs: 3, sm: 4 },
              background: 'linear-gradient(135deg, #A52D0C 0%, #D32F2F 100%)',
              color: 'white',
              borderRadius: 2,
            }}
          >
            <Typography
              variant="h4"
              component="h2"
              id="call-to-action"
              sx={{
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: '1.5rem', sm: '2rem' },
              }}
            >
              🚴‍♂️ Non perdere questa occasione!
            </Typography>
            <Typography
              variant="h6"
              sx={{
                opacity: 0.9,
                fontSize: { xs: '1rem', sm: '1.2rem' },
              }}
            >
              Vieni al Beverino Bike Festival il 21 settembre 2025 e partecipa alla lotteria!
            </Typography>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default LotteriaPage;
