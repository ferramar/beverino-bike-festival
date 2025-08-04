// src/app/test-stripe/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Box, Button, Typography, Alert } from '@mui/material';

export default function TestStripePage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [details, setDetails] = useState<any>({});

  useEffect(() => {
    testStripe();
  }, []);

  const testStripe = async () => {
    const results: any = {};
    
    try {
      // 1. Verifica variabile ambiente
      const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      results.keyExists = !!key;
      results.keyPrefix = key?.substring(0, 7);
      results.keyLength = key?.length;
      
      // 2. Prova a caricare Stripe
      console.log('Caricamento Stripe...');
      const stripe = await loadStripe(key!);
      results.stripeLoaded = !!stripe;
      
      // 3. Test chiamata API
      const response = await fetch('/api/test-stripe', {
        method: 'GET',
      });
      results.apiStatus = response.status;
      results.apiOk = response.ok;
      
      setDetails(results);
      setStatus(results.stripeLoaded ? 'success' : 'error');
    } catch (error: any) {
      console.error('Test fallito:', error);
      results.error = error.message;
      setDetails(results);
      setStatus('error');
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Test Connessione Stripe
      </Typography>
      
      {status === 'loading' && <Typography>Caricamento...</Typography>}
      
      {status === 'error' && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Errore nel caricamento di Stripe
        </Alert>
      )}
      
      {status === 'success' && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Stripe caricato correttamente!
        </Alert>
      )}
      
      <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
        <Typography variant="h6">Dettagli:</Typography>
        <pre>{JSON.stringify(details, null, 2)}</pre>
      </Box>
      
      <Button 
        variant="contained" 
        onClick={testStripe}
        sx={{ mt: 2 }}
      >
        Riprova Test
      </Button>
    </Box>
  );
}