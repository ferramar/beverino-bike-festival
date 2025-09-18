"use client";
import { Container, Typography, Box, Paper, Button } from '@mui/material';
import Link from 'next/link';
import IscrizioneWizard from "../../components/IscrizioneWizard";
import { isRegistrationOpen } from "../../utils/isRegistrationOpen";

function RegistrationClosed() {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom fontWeight={700} color="#A52D0C">
          Iscrizioni Chiuse
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Le iscrizioni online si sono chiuse il 20 settembre 2025 alle ore 23:59
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button component={Link} href="/programma" variant="contained" sx={{ backgroundColor: '#A52D0C' }}>
            Programma dell'Evento
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
