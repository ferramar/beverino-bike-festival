'use client';
import Link from 'next/link';
import { Container, Typography, Paper, Box, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MediaUploadForm from '@/components/MediaUploadForm';

export default function GestisciGalleriaPage() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Button
        component={Link}
        href="/gestisci-contenuti"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 2 }}
      >
        Indietro
      </Button>
      <Typography variant="h4" gutterBottom fontWeight={700}>
        Galleria foto
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Scegli l&apos;edizione e carica le foto: verranno ridimensionate automaticamente e
        pubblicate sulla galleria del sito.
      </Typography>
      <Box component={Paper} sx={{ p: 3 }}>
        <MediaUploadForm />
      </Box>
    </Container>
  );
}
