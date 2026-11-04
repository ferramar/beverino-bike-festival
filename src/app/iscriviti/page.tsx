"use client";
import { Container, Typography, Box, Paper, Button } from '@mui/material';
import Link from 'next/link';
import IscrizioneWizard from "../../components/IscrizioneWizard";
import { isRegistrationOpen, getRegistrationOpeningDate } from "../../utils/isRegistrationOpen";

function RegistrationClosed() {
  const now = new Date();
  const opening = getRegistrationOpeningDate();
  const notYetOpen = now < opening;

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom fontWeight={700} color="#A52D0C">
          {notYetOpen ? 'Iscrizioni in arrivo' : 'Iscrizioni Chiuse'}
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          {notYetOpen
            ? 'Le iscrizioni online apriranno a breve: seguici sui social per gli aggiornamenti.'
            : 'Le iscrizioni online non sono attive. Seguici sui social per sapere quando apriranno quelle della prossima edizione.'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button component={Link} href="/galleria" variant="contained" sx={{ backgroundColor: '#A52D0C' }}>
            Guarda la Galleria
          </Button>
          <Button component={Link} href="/percorsi" variant="outlined" sx={{ borderColor: '#A52D0C', color: '#A52D0C' }}>
            Vedi i Percorsi
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default function Iscriviti() {
  return isRegistrationOpen() ? <IscrizioneWizard /> : <RegistrationClosed />;
}
