'use client';

import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
  Tabs,
  Tab,
  Stack,
  useTheme,
  useMediaQuery,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from '@mui/lab';
import { useState } from 'react';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import FlagIcon from '@mui/icons-material/Flag';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import { motion } from 'framer-motion';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`program-tabpanel-${index}`}
      aria-labelledby={`program-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// Timeline data
const timelineData = [
  {
    time: '07:00',
    title: 'Apertura Segreteria',
    description: 'Ritiro pettorali e pacco gara presso il centro sportivo',
    icon: <HowToRegIcon />,
    color: 'primary' as const,
  },
  {
    time: '08:30',
    title: 'Briefing Pre-Gara',
    description: 'Presentazione percorsi e ultime informazioni tecniche',
    icon: <InfoIcon />,
    color: 'info' as const,
  },
  {
    time: '08:45',
    title: 'Partenza giro lungo',
    description: 'Partenza del percorso lungo per i più esperti',
    icon: <FlagIcon />,
    color: 'error' as const,
    highlight: true,
  },
  {
    time: '09:00',
    title: 'Partenza giro medio e bici in comune',
    description: 'Partenza dei percorsi medio e corto',
    icon: <DirectionsBikeIcon />,
    color: 'warning' as const,
    highlight: true,
  },
  {
    time: '10:00 - 14:00',
    title: 'Ristori sul Percorso',
    description: 'Punti ristoro aperti lungo tutti i percorsi',
    icon: <RestaurantIcon />,
    color: 'success' as const,
  },
  {
    time: '12:00',
    title: 'Apertura Area Food',
    description: 'Street food e specialità locali per atleti e accompagnatori',
    icon: <RestaurantIcon />,
    color: 'secondary' as const,
  },
  {
    time: '14:00',
    title: 'Inizio Premiazioni',
    description: 'Premiazione dei primi classificati di ogni categoria',
    icon: <EmojiEventsIcon />,
    color: 'warning' as const,
    highlight: true,
  },
  {
    time: '15:00',
    title: 'Musica Live',
    description: 'Intrattenimento musicale con band locali',
    icon: <MusicNoteIcon />,
    color: 'secondary' as const,
  },
  {
    time: '17:00',
    title: 'Chiusura Evento',
    description: 'Saluti finali e arrivederci alla prossima edizione',
    icon: <FlagIcon />,
    color: 'primary' as const,
  },
];

// Servizi disponibili
const services = [
  { icon: <LocalParkingIcon />, title: 'Parcheggio Gratuito', description: 'Ampio parcheggio riservato ai partecipanti' },
  { icon: <RestaurantIcon />, title: 'Area Ristoro', description: 'Food truck e stand gastronomici' },
  { icon: <DirectionsBikeIcon />, title: 'Assistenza Meccanica', description: 'Servizio riparazione bici sul posto' },
  { icon: <HowToRegIcon />, title: 'Spogliatoi e Docce', description: 'Servizi completi post-gara' },
];

export default function ProgrammaPage() {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box 
      sx={{ py: { xs: 6, md: 8 }, backgroundColor: '#fafafa', minHeight: '100vh' }}
    >
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
            Programma dell'Evento
          </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary"
            sx={{ maxWidth: 700, mx: 'auto' }}
          >
            Una giornata all'insegna dello sport, del divertimento e della condivisione
          </Typography>
        </Box>

        {/* Alert informativo */}
        <Alert 
          severity="info" 
          sx={{ mb: 4, borderRadius: 2 }}
          icon={<InfoIcon />}
          role="region"
          aria-label="Avviso importante"
        >
          <Typography variant="body1">
            <strong>Nota:</strong> Il programma potrebbe subire variazioni. 
            Ti consigliamo di consultare questa pagina nei giorni precedenti l'evento per eventuali aggiornamenti.
          </Typography>
        </Alert>

        {/* Tabs per diverse viste */}
        <Paper 
          elevation={0} 
          sx={{ mb: 4, borderRadius: 2 }}
          role="navigation"
          aria-label="Navigazione sezioni programma"
        >
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant={isMobile ? "fullWidth" : "standard"}
            centered={!isMobile}
            aria-label="Sezioni del programma"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: '1rem',
                '&:focus': {
                  outline: '3px solid',
                  outlineColor: 'primary.main',
                  outlineOffset: '-3px',
                }
              }
            }}
          >
            <Tab 
              label="Timeline Giornata" 
              id="program-tab-0"
              aria-controls="program-tabpanel-0"
            />
            <Tab 
              label="Info Percorsi" 
              id="program-tab-1"
              aria-controls="program-tabpanel-1"
            />
            <Tab 
              label="Servizi & Logistica" 
              id="program-tab-2"
              aria-controls="program-tabpanel-2"
            />
          </Tabs>
        </Paper>

        {/* Tab 1: Timeline */}
        <TabPanel value={tabValue} index={0}>
          <Timeline 
            position={isMobile ? "right" : "alternate"}
            sx={{
              // Su mobile, sposta la timeline a sinistra
              ...(isMobile && {
                '& .MuiTimelineItem-root': {
                  '&:before': {
                    flex: 0,
                    padding: 0,
                  },
                },
                '& .MuiTimelineSeparator-root': {
                  marginRight: 2,
                },
                '& .MuiTimelineConnector-root': {
                  marginLeft: 1.5,
                },
                '& .MuiTimelineDot-root': {
                  margin: 0,
                },
              }),
            }}
          >
            {timelineData.map((item, index) => (
              <TimelineItem key={index}>
                {!isMobile && (
                  <TimelineOppositeContent 
                    color="text.secondary"
                    aria-label={`Orario: ${item.time}`}
                  >
                    <Typography variant="h6" component="span" fontWeight={600}>
                      {item.time}
                    </Typography>
                  </TimelineOppositeContent>
                )}
                <TimelineSeparator>
                  <TimelineDot 
                    color={item.color}
                    variant={item.highlight ? "filled" : "outlined"}
                    sx={{ 
                      boxShadow: item.highlight ? 3 : 0,
                      transform: item.highlight ? 'scale(1.2)' : 'scale(1)',
                    }}
                    aria-label={`${item.title} - ${item.highlight ? 'Evento principale' : 'Evento'}`}
                  >
                    {item.icon}
                  </TimelineDot>
                  {index < timelineData.length - 1 && (
                    <TimelineConnector aria-hidden="true" />
                  )}
                </TimelineSeparator>
                <TimelineContent sx={{ 
                  py: 2,
                  ...(isMobile && { pl: 0, pr: 0 })
                }}>
                  <motion.div
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card 
                      elevation={0}
                      component="article"
                      sx={{ 
                        border: '1px solid',
                        borderColor: 'divider',
                        '&:hover': {
                          boxShadow: 2,
                          transform: 'translateY(-2px)',
                          transition: 'all 0.3s ease'
                        },
                        '&:focus-within': {
                          outline: '3px solid',
                          outlineColor: 'primary.main',
                          outlineOffset: '2px',
                        }
                      }}
                      tabIndex={0}
                      aria-label={`${item.time}: ${item.title} - ${item.description}`}
                    >
                      <CardContent>
                        {isMobile && (
                          <Typography 
                            variant="caption" 
                            color="text.secondary" 
                            gutterBottom 
                            display="block"
                            component="time"
                            fontWeight={600}
                          >
                            {item.time}
                          </Typography>
                        )}
                        <Typography variant="h6" component="h3" gutterBottom fontWeight={600}>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.description}
                        </Typography>
                        {item.highlight && (
                          <Chip 
                            label="Momento chiave" 
                            size="small" 
                            color="primary" 
                            sx={{ mt: 1 }}
                            aria-label="Questo è un momento chiave dell'evento"
                          />
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </TabPanel>

        {/* Tab 2: Info Percorsi */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            {[
              { 
                km: 32, 
                difficulty: 'Facile', 
                color: 'success',
                elevation: '800m',
                description: 'Percorso ideale per principianti e famiglie',
                highlights: ['Panorami mozzafiato', 'Strade poco trafficate', '2 punti ristoro']
              },
              { 
                km: 35, 
                difficulty: 'Medio', 
                color: 'warning',
                elevation: '1150m',
                description: 'Per ciclisti con buona preparazione',
                highlights: ['Salite impegnative', 'Discese tecniche', '3 punti ristoro']
              },
              { 
                km: 50, 
                difficulty: 'Difficile', 
                color: 'error',
                elevation: '1700m',
                description: 'Sfida per ciclisti esperti',
                highlights: ['Percorso completo', 'Viste spettacolari', '3 punti ristoro']
              },
            ].map((route, index) => (
              <Grid size={{ xs: 12, md: 4 }} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card 
                    elevation={0}
                    sx={{ 
                      height: '100%',
                      border: '2px solid',
                      borderColor: `${route.color}.main`,
                      position: 'relative',
                      overflow: 'visible',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4,
                        transition: 'all 0.3s ease'
                      }
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -20,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: `${route.color}.main`,
                        color: 'white',
                        borderRadius: 2,
                        px: 3,
                        py: 1,
                        boxShadow: 2
                      }}
                      aria-label={`Percorso di ${route.km} chilometri`}
                    >
                      <Typography variant="h4" fontWeight={800}>
                        {route.km}km
                      </Typography>
                    </Box>
                    <CardContent sx={{ mt: 4 }}>
                      <Stack spacing={2}>
                        <Box textAlign="center">
                          <Chip 
                            label={route.difficulty} 
                            color={route.color as any}
                            size="small"
                            aria-label={`Livello di difficoltà: ${route.difficulty}`}
                          />
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Dislivello: {route.elevation}
                          </Typography>
                        </Box>
                        <Typography variant="body1" textAlign="center">
                          {route.description}
                        </Typography>
                        <List dense>
                          {route.highlights.map((highlight, idx) => (
                            <ListItem key={idx} disablePadding>
                              <ListItemIcon sx={{ minWidth: 32 }}>
                                <CheckCircleIcon fontSize="small" color="primary" />
                              </ListItemIcon>
                              <ListItemText primary={highlight} />
                            </ListItem>
                          ))}
                        </List>
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* Tab 3: Servizi */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            {services.map((service, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      height: '100%',
                      textAlign: 'center',
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'translateY(-4px)',
                        boxShadow: 2,
                        transition: 'all 0.3s ease'
                      }
                    }}
                  >
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: '50%',
                        backgroundColor: 'primary.light',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                        color: 'primary.main'
                      }}
                      aria-hidden="true"
                    >
                      {service.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                      {service.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {service.description}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Info aggiuntive */}
          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" gutterBottom fontWeight={600} textAlign="center">
              Informazioni Utili
            </Typography>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Come Raggiungerci
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Indirizzo:</strong> Centro Sportivo Comunale, Via dello Sport 1, Beverino (SP)
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Coordinate GPS:</strong> 44.1234, 9.5678
                  </Typography>
                  <Typography variant="body2">
                    Ampio parcheggio gratuito disponibile. Seguire le indicazioni "Beverino Bike Festival".
                  </Typography>
                </Card>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider' }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Cosa Portare
                  </Typography>
                  <List dense>
                    <ListItem disablePadding>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Documento d'identità e tessera sanitaria" />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Casco omologato (obbligatorio)" />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Kit riparazione forature" />
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Borraccia e barrette energetiche" />
                    </ListItem>
                  </List>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </TabPanel>
      </Container>
    </Box>
  );
}