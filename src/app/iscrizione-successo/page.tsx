"use client"

import { CheckCircleOutline } from "@mui/icons-material";
import { Box, Button, Container, Typography } from "@mui/material";
import Link from "next/link";
import { useEffect } from "react";

export default function IscrizioneSuccesso() {
  useEffect(() => {
    localStorage.removeItem('iscrizione');
  })

  return (
    <Box component="main" sx={{
      pt: "8rem",
      pb: 4
    }}>
      <Container maxWidth="sm" sx={{ textAlign: 'center', py: 8 }}>
        <Box sx={{ mb: 4 }}>
          <CheckCircleOutline color="success" sx={{ fontSize: 64 }} />
        </Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Iscrizione Completata!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Grazie per aver completato il pagamento.
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          La tua partecipazione al Beverino Bike Festival è stata confermata.
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button LinkComponent={Link} href='/' variant="contained" size="large">Torna alla home</Button>
        </Box>
      </Container>
    </Box>
  );
}
