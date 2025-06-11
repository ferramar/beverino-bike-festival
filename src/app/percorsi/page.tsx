'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Divider,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import {
  Timeline,
  Terrain,
  Speed,
  Schedule,
  ExpandMore,
  DirectionsBike,
  Straighten,
  TrendingUp,
  Download,
} from '@mui/icons-material';
import dynamic from 'next/dynamic';

// Componente per visualizzare GPX con GPX Studio
function GPXMap({ gpxFile, height = 400 }: { gpxFile: string; height?: number }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // URL ottimizzato per GPX Studio con parametri per nascondere UI
  const gpxFileUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/gpx/${gpxFile}`;

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setError('Errore nel caricamento della mappa');
    setIsLoading(false);
  };

  // Timeout per gestire casi in cui onLoad non scatta
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [isLoading]);

  if (error) {
    return (
      <Box
        sx={{
          width: '100%',
          height: height,
          bgcolor: '#fff',
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #ddd',
          p: 3,
        }}
      >
        <DirectionsBike sx={{ fontSize: 48, mb: 2, opacity: 0.5, color: '#BF360C' }} />
        <Typography variant="body1" color="error" textAlign="center" sx={{ mb: 2 }}>
          {error}
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            size="small"
            startIcon={<Download />}
            onClick={() => {
              const link = document.createElement('a');
              link.href = `/gpx/${gpxFile}`;
              link.download = gpxFile;
              link.click();
            }}
            sx={{
              backgroundColor: '#BF360C',
              '&:hover': {
                backgroundColor: '#D32F2F',
              },
            }}
          >
            Scarica GPX
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              window.open(`https://gpx.studio/?state=${encodeURIComponent(JSON.stringify({ urls: [gpxFileUrl] }))}`, '_blank');
            }}
            sx={{
              borderColor: '#BF360C',
              color: '#BF360C',
              '&:hover': {
                borderColor: '#D32F2F',
                color: '#D32F2F',
              },
            }}
          >
            Apri in GPX Studio
          </Button>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: height, position: 'relative' }}>
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            zIndex: 1000,
            borderRadius: 2,
          }}
        >
          <Box sx={{
            width: 40,
            height: 40,
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #BF360C',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            mb: 2,
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' },
            },
          }} />
          <Typography variant="body2" color="text.secondary">
            Caricamento mappa interattiva...
          </Typography>
        </Box>
      )}

      <iframe 
        src={"https://gpx.studio/embed?options=%7B%22token%22%3A%22pk.eyJ1IjoibG9sbG9tYWciLCJhIjoiY21icjFzbzVzMDU0NjJsczdvcHA5bzh0ZSJ9.Kwsyv3hGs6qC8GP6099UkQ%22%2C%22files%22%3A%5B%22https%3A%2F%2Fstylish-flowers-c12f2e4071.media.strapiapp.com%2Fgiro_corto_17e634af01.gpx%22%5D%2C%22elevation%22%3A%7B%22height%22%3A%22200%22%2C%22fill%22%3A%22slope%22%7D%2C%22distanceMarkers%22%3Atrue%7D"}
        width="100%" 
        height="100%" 
        style={{
          border: 'none',
          borderRadius: '8px',
          display: isLoading ? 'none' : 'block',
        }}
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        title={`Mappa del percorso ${gpxFile}`}
        allow="geolocation"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-popups"
      />
    </Box>
  );
}

// Dati di esempio per i percorsi
const percorsiData = [
  {
    id: 1,
    nome: "Percorso Principianti",
    difficolta: "Facile",
    distanza: "15 km",
    dislivello: "200 m",
    durata: "1-2 ore",
    gpxFile: "https://gpx.studio/embed?options=%7B%22token%22%3A%22pk.eyJ1IjoibG9sbG9tYWciLCJhIjoiY21icjFzbzVzMDU0NjJsczdvcHA5bzh0ZSJ9.Kwsyv3hGs6qC8GP6099UkQ%22%2C%22files%22%3A%5B%22https%3A%2F%2Fstylish-flowers-c12f2e4071.media.strapiapp.com%2Fgiro_corto_17e634af01.gpx%22%5D%2C%22elevation%22%3A%7B%22height%22%3A%22200%22%2C%22fill%22%3A%22slope%22%7D%2C%22distanceMarkers%22%3Atrue%7D",
    descrizione: "Un percorso ideale per chi si avvicina al mondo del mountain bike. Tracciato prevalentemente su sterrato con pendenze dolci e panorami mozzafiato sulla valle. Adatto a famiglie e principianti che vogliono godersi la natura senza troppa fatica.",
    puntiInteresse: [
      "Punto panoramico Monte Verde",
      "Borgo medievale di Castelnuovo",
      "Area picnic Pian del Lago"
    ],
    difficoltaColore: "success",
    immagine: "/percorso1.jpg"
  },
  {
    id: 2,
    nome: "Percorso Intermedio",
    difficolta: "Medio",
    distanza: "28 km",
    dislivello: "450 m",
    durata: "2-3 ore",
    gpxFile: "giro_medio.gpx",
    descrizione: "Un tracciato che mette alla prova le vostre capacità tecniche con single track divertenti e alcuni passaggi più impegnativi. Attraversa boschi secolari e antichi sentieri dei carbonari, offrendo un perfetto equilibrio tra sfida e divertimento.",
    puntiInteresse: [
      "Sentiero dei Carbonari",
      "Bosco delle Fate",
      "Cascata del Torrente Chiaro",
      "Rifugio Monte Rosso"
    ],
    difficoltaColore: "warning",
    immagine: "/percorso2.jpg"
  },
  {
    id: 3,
    nome: "Percorso Esperti",
    difficolta: "Difficile",
    distanza: "42 km",
    dislivello: "850 m",
    durata: "3-4 ore",
    gpxFile: "giro_lungo.gpx",
    descrizione: "La sfida definitiva per i biker più esperti. Tracciato tecnico con single track impegnativi, rocce, radici e discese mozzafiato. Solo per chi ha esperienza e allenamento adeguato. La fatica sarà ripagata da panorami unici e dall'adrenalina pura.",
    puntiInteresse: [
      "Cresta del Diavolo",
      "Single track della Morte",
      "Vetta Monte Inferno",
      "Discesa del Brivido",
      "Passo delle Aquile"
    ],
    difficoltaColore: "error",
    immagine: "/percorso3.jpg"
  }
];

export default function PercorsiPage() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedPercorso, setSelectedPercorso] = useState(percorsiData[0]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
    setSelectedPercorso(percorsiData[newValue]);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Hero Section */}
      <Box textAlign="center" sx={{ mb: 6 }}>
        <Typography variant="h2" component="h1" gutterBottom fontWeight={700}>
          Percorsi del Festival
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
          Scopri i tracciati che abbiamo preparato per te. Tre livelli di difficoltà per soddisfare
          ogni tipo di biker, dai principianti agli esperti più temerari.
        </Typography>

        {/* Statistiche generali */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card elevation={2} sx={{ p: 2, textAlign: 'center' }}>
              <Straighten sx={{ fontSize: 40, color: '#BF360C', mb: 1 }} />
              <Typography variant="h4" fontWeight={700} color="#BF360C">
                85 km
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Distanza totale
              </Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card elevation={2} sx={{ p: 2, textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, color: '#BF360C', mb: 1 }} />
              <Typography variant="h4" fontWeight={700} color="#BF360C">
                1500m
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Dislivello massimo
              </Typography>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card elevation={2} sx={{ p: 2, textAlign: 'center' }}>
              <Timeline sx={{ fontSize: 40, color: '#BF360C', mb: 1 }} />
              <Typography variant="h4" fontWeight={700} color="#BF360C">
                3
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Livelli di difficoltà
              </Typography>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Tabs per selezione percorso */}
      <Box sx={{ mb: 4 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          centered
          sx={{
            '& .MuiTab-root': {
              fontWeight: 600,
              fontSize: '1.1rem',
              textTransform: 'none',
              minWidth: 200,
            },
            '& .Mui-selected': {
              color: '#BF360C',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#BF360C',
              height: 3,
            },
          }}
        >
          {percorsiData.map((percorso, index) => (
            <Tab
              key={percorso.id}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DirectionsBike />
                  {percorso.nome}
                </Box>
              }
            />
          ))}
        </Tabs>
      </Box>

      {/* Dettaglio percorso selezionato */}
      <Grid container spacing={4}>
        {/* Colonna sinistra - Info percorso */}
        <Grid size={{ xs: 12, lg: 5 }}>
          <Card elevation={3}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h4" gutterBottom fontWeight={700}>
                  {selectedPercorso.nome}
                </Typography>
                <Chip
                  label={selectedPercorso.difficolta}
                  color={selectedPercorso.difficoltaColore as any}
                  size="medium"
                  sx={{ fontWeight: 600 }}
                />
              </Box>

              {/* Statistiche percorso */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 4 }}>
                  <Box textAlign="center">
                    <Straighten sx={{ color: '#666', mb: 0.5 }} />
                    <Typography variant="h6" fontWeight={600}>
                      {selectedPercorso.distanza}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Distanza
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Box textAlign="center">
                    <Terrain sx={{ color: '#666', mb: 0.5 }} />
                    <Typography variant="h6" fontWeight={600}>
                      {selectedPercorso.dislivello}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Dislivello
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Box textAlign="center">
                    <Schedule sx={{ color: '#666', mb: 0.5 }} />
                    <Typography variant="h6" fontWeight={600}>
                      {selectedPercorso.durata}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Durata
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Descrizione */}
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
                {selectedPercorso.descrizione}
              </Typography>

              {/* Punti di interesse */}
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant="h6" fontWeight={600}>
                    Punti di interesse
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={1}>
                    {selectedPercorso.puntiInteresse.map((punto, index) => (
                      <Typography key={index} variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {punto}
                      </Typography>
                    ))}
                  </Stack>
                </AccordionDetails>
              </Accordion>

              {/* Download GPX */}
              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<Download />}
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = `/gpx/${selectedPercorso.gpxFile}`;
                  link.download = selectedPercorso.gpxFile;
                  link.click();
                }}
                sx={{
                  mt: 3,
                  backgroundColor: '#BF360C',
                  '&:hover': {
                    backgroundColor: '#D32F2F',
                  },
                }}
              >
                Scarica tracciato GPX
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Colonna destra - Mappa */}
        <Grid size={{ xs: 12, lg: 7 }}>
          <Card elevation={3} sx={{ height: 'auto', minHeight: 300 }}>
            <CardContent sx={{ height: '100%', p: "0 !important" }}>
              <Typography variant="h6" sx={visuallyHidden} >
                Tracciato GPS
              </Typography>
              <GPXMap gpxFile={selectedPercorso.gpxFile} height={500} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Sezione info aggiuntive */}
      <Box sx={{ mt: 8, p: 4, bgcolor: '#f8f9fa', borderRadius: 3 }}>
        <Typography variant="h5" gutterBottom fontWeight={600} textAlign="center">
          Informazioni importanti
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box textAlign="center">
              <Speed sx={{ fontSize: 40, color: '#BF360C', mb: 2 }} />
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Attrezzatura
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Casco obbligatorio, protezioni consigliate per percorsi difficili
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box textAlign="center">
              <Schedule sx={{ fontSize: 40, color: '#BF360C', mb: 2 }} />
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Orari
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Partenze scaglionate dalle 8:00 alle 10:00 del mattino
              </Typography>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box textAlign="center">
              <Timeline sx={{ fontSize: 40, color: '#BF360C', mb: 2 }} />
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Assistenza
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Punti di assistenza tecnica e ristoro lungo tutti i percorsi
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}