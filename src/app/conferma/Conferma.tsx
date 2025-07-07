'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Container, 
  Typography, 
  Box, 
  Alert, 
  CircularProgress,
  Button 
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Link from 'next/link';

export default function Conferma() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    // Pulizia localStorage
    try {
      localStorage.removeItem('iscrizione');
    } catch (error) {
      console.warn('Errore pulizia localStorage:', error);
    }

    // Verifica pagamento se presente session_id
    if (sessionId && !isVerifying) {
      setIsVerifying(true); 
      fetch(`/api/verify-payment?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.status === 'complete' || data.payment_status === 'paid') {
            setPaymentStatus('success');
            setPaymentDetails(data);
          } else {
            setPaymentStatus('error');
          }
        })
        .catch(() => {
          setPaymentStatus('error');
        });
    } else {
      // Nessun session_id, assume successo per compatibilità
      setPaymentStatus('success');
    }
  }, [sessionId]);

  if (paymentStatus === 'loading') {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} color="primary" />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Verifica del pagamento in corso...
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Attendere prego...
        </Typography>
      </Container>
    );
  }

  if (paymentStatus === 'error') {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box textAlign="center">
          <Alert severity="error" sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Errore nella verifica del pagamento
            </Typography>
            <Typography>
              Si è verificato un problema durante la verifica del pagamento. 
              Se hai già effettuato il pagamento, contattaci per assistenza.
            </Typography>
          </Alert>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button component={Link} href="/" variant="contained">
              Torna alla Home
            </Button>
            <Button component={Link} href="/iscriviti" variant="outlined">
              Riprova Iscrizione
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
      <Box sx={{ mb: 4 }}>
        <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom color="success.main" fontWeight={600}>
          Iscrizione Completata!
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Il tuo pagamento è stato elaborato con successo
        </Typography>
      </Box>

      <Alert severity="success" sx={{ mb: 4, textAlign: 'center', justifyContent: "center" }}>
        <Typography variant="body1" fontWeight={500}>
          🎉 <strong>Complimenti!</strong> La tua iscrizione al Beverino Bike Festival è stata confermata.
        </Typography>
        {paymentDetails?.payment_intent && (
          <Typography variant="body2" sx={{ mt: 1, fontFamily: 'monospace' }}>
            ID Pagamento: {paymentDetails.payment_intent}
          </Typography>
        )}
        {paymentDetails?.amount_total && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Importo: €{(paymentDetails.amount_total / 100).toFixed(2)}
          </Typography>
        )}
      </Alert>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Prossimi passi:
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          • Riceverai una <strong>email di conferma</strong> con tutti i dettagli dell'evento
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          • Le <strong>istruzioni per la giornata</strong> della gara ti verranno inviate nei prossimi giorni
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          • Consulta il <strong>programma completo</strong> per conoscere tutti gli orari
        </Typography>
      </Box>

      <Box>
        <Button 
          component={Link} 
          href="/" 
          variant="contained" 
          size="large"
          sx={{ mr: 2, mb: { xs: 2, sm: 0 } }}
        >
          Torna alla Home
        </Button>
        <Button 
          component={Link} 
          href="/programma" 
          variant="outlined" 
          size="large"
        >
          Visualizza Programma
        </Button>
      </Box>
    </Container>
  );
}