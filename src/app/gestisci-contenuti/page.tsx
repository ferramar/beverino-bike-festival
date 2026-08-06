'use client';
import Link from 'next/link';
import {
  Container,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Box,
} from '@mui/material';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import HandshakeIcon from '@mui/icons-material/Handshake';
import LabelIcon from '@mui/icons-material/Label';

type Sezione = {
  titolo: string;
  descrizione: string;
  href?: string;
  icon: React.ReactNode;
};

const SEZIONI: Sezione[] = [
  {
    titolo: 'Galleria foto',
    descrizione: "Carica nuove foto nella galleria del sito, assegnandole a un'edizione.",
    href: '/gestisci-contenuti/galleria',
    icon: <PhotoLibraryIcon fontSize="large" />,
  },
  {
    titolo: 'Sponsor',
    descrizione: 'Visualizza, aggiungi, modifica o elimina gli sponsor del sito.',
    href: '/gestisci-contenuti/sponsor',
    icon: <HandshakeIcon fontSize="large" />,
  },
  {
    titolo: 'Categorie sponsor',
    descrizione: 'Visualizza, aggiungi, modifica o elimina le categorie usate per gli sponsor.',
    href: '/gestisci-contenuti/categorie-sponsor',
    icon: <LabelIcon fontSize="large" />,
  },
];

export default function GestisciContenutiPage() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom fontWeight={700}>
        Gestisci contenuti
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Scegli cosa vuoi aggiornare sul sito.
      </Typography>
      <Stack spacing={2}>
        {SEZIONI.map((sezione) => (
          <Card key={sezione.titolo} variant="outlined">
            <CardActionArea component={Link} href={sezione.href || '#'} sx={{ p: 1 }}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box sx={{ color: 'primary.main' }}>{sezione.icon}</Box>
                  <Box>
                    <Typography variant="h6">{sezione.titolo}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {sezione.descrizione}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}
