import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { getStripe } from '../../lib/stripe';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { PRICING } from '../../config/event';
import { getGaraPrice } from '../../config/pricing';
import { getGaraDisplayName } from '../../config/liberatorie';

function isLiveStripeOnHttp(): boolean {
  if (typeof window === 'undefined') return false;
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '';
  return key.startsWith('pk_live') && window.location.protocol === 'http:';
}

// Componente interno che usa gli hooks di Stripe
function PaymentForm({ 
  totalAmount, 
  onSuccess,
  registrationId,
  codiceRegistrazione,
  userEmail,
  tipoGara,
  pastaPartyCount = 0,
}: { 
  totalAmount: number;
  onSuccess: () => void;
  registrationId: number;
  codiceRegistrazione: string;
  userEmail?: string;
  tipoGara?: string;
  pastaPartyCount?: number;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);
  const [cardReady, setCardReady] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    try {
      // 1. Crea payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: totalAmount * 100, // in centesimi
          metadata: {
            registrationId: String(registrationId),
            codice_registrazione: codiceRegistrazione,
            email: userEmail || '',
            tipo_gara: tipoGara || '',
            pasta_party_count: String(pastaPartyCount),
          },
          receipt_email: userEmail, // Email per la ricevuta Stripe
        }),
      });

      const { clientSecret } = await response.json();

      // 2. Conferma il pagamento
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (confirmError) {
        setError(confirmError.message || 'Errore nel pagamento');
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        setSucceeded(true);
        
        // 3. Verifica pagamento e invia email tramite backend
        try {
          const verifyResponse = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              paymentIntentId: paymentIntent.id,
              registrationId,
              codiceRegistrazione,
            }),
          });

          const verifyData = await verifyResponse.json();
          
          if (!verifyResponse.ok) {
            console.error('Errore verifica pagamento:', verifyData);
            if (verifyData.error && verifyData.error.includes('email')) {
              setError('Pagamento completato ma email non inviata. Contatta l\'assistenza.');
            }
          } else {
            console.log('Verifica completata:', verifyData);
            if (!verifyData.email_sent) {
              console.warn('Email non inviata:', verifyData.message || verifyData.error);
            }
          }
        } catch (error) {
          console.error('Errore chiamata verify-payment:', error);
        }
        
        // Procedi comunque con il success
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Si è verificato un errore');
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        fontFamily: '"Inter", "Roboto", sans-serif',
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: true,
  };

  if (succeeded) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Pagamento completato!
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          Stiamo processando la tua iscrizione...
        </Typography>
        
        <Typography variant="body2" sx={{ mt: 2 }}>
          Riceverai una email di conferma all'indirizzo registrato.
        </Typography>
        
        {error && (
          <Alert severity="warning" sx={{ mt: 2, maxWidth: 400, mx: 'auto' }}>
            {error}
          </Alert>
        )}
      </Box>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <LockIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="h6">
              Pagamento sicuro
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Inserisci i dati della tua carta di credito
            </Typography>
            <Box sx={{ 
              p: 2, 
              border: '1px solid', 
              borderColor: 'divider',
              borderRadius: 1,
              minHeight: 50,
              position: 'relative',
              '&:hover': {
                borderColor: 'primary.main',
              },
              '&:focus-within': {
                borderColor: 'primary.main',
                borderWidth: 2,
                p: '15px',
              }
            }}>
              {!stripe || !elements ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 40 }}>
                  <CircularProgress size={20} sx={{ mr: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    Caricamento form pagamento...
                  </Typography>
                </Box>
              ) : (
                <CardElement 
                  options={cardElementOptions}
                  onReady={() => setCardReady(true)}
                  onChange={(event) => {
                    if (event.error) {
                      setError(event.error.message);
                    } else {
                      setError(null);
                    }
                  }}
                />
              )}
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6">
              Totale da pagare:
            </Typography>
            <Typography variant="h5" color="primary" fontWeight={700}>
              €{totalAmount.toFixed(2)}
            </Typography>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={!stripe || !elements || loading || !cardReady}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? 'Elaborazione...' : !cardReady ? 'Caricamento...' : `Paga €${totalAmount.toFixed(2)}`}
          </Button>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block', textAlign: 'center' }}>
            Pagamento sicuro gestito da Stripe. I tuoi dati sono protetti.
          </Typography>
          
          {/* Fallback se il form non si carica */}
          {!cardReady && !loading && stripe && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2" gutterBottom>
                {isLiveStripeOnHttp()
                  ? 'In locale con chiavi Stripe live serve HTTPS oppure usa le chiavi test (pk_test_) in .env.local.'
                  : 'Il form di pagamento sta impiegando più del previsto a caricarsi.'}
              </Typography>
              {!isLiveStripeOnHttp() && (
                <Button
                  size="small"
                  onClick={() => window.location.reload()}
                  sx={{ mt: 1 }}
                >
                  Ricarica la pagina
                </Button>
              )}
            </Alert>
          )}
        </CardContent>
      </Card>
    </form>
  );
}

// Componente wrapper con Elements provider
export default function PaymentStep({ 
  totalAmount,
  onSuccess,
  registrationId,
  codiceRegistrazione,
  tipoGara,
  pastaPartyCount,
  userEmail,
}: {
  totalAmount: number;
  onSuccess: () => void;
  registrationId: number;
  codiceRegistrazione: string;
  tipoGara?: string;
  pastaPartyCount?: number;
  userEmail?: string;
}) {
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const [liveOnHttp, setLiveOnHttp] = useState(false);

  useEffect(() => {
    setLiveOnHttp(isLiveStripeOnHttp());
  }, []);

  useEffect(() => {
    if (liveOnHttp) return;

    let cancelled = false;

    getStripe()
      .then((stripe) => {
        if (!cancelled) setStripeLoaded(!!stripe);
      })
      .catch(() => {
        if (!cancelled) setStripeLoaded(false);
      });

    return () => {
      cancelled = true;
    };
  }, [liveOnHttp]);

  if (liveOnHttp) {
    return (
      <Box>
        {(tipoGara || pastaPartyCount) && (
          <Card elevation={0} sx={{ mb: 3, p: 2, bgcolor: 'grey.50' }}>
            <Typography variant="subtitle2" gutterBottom fontWeight={600}>
              Riepilogo ordine:
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="subtitle2" fontWeight={600}>
                Totale
              </Typography>
              <Typography variant="subtitle2" fontWeight={600}>
                €{totalAmount.toFixed(2)}
              </Typography>
            </Box>
          </Card>
        )}
        <Alert severity="warning">
          <Typography variant="body2" fontWeight={600} gutterBottom>
            Pagamento non disponibile in locale con chiavi live
          </Typography>
          <Typography variant="body2">
            Stripe richiede HTTPS per le integrazioni live. Su <code>http://localhost</code>{' '}
            usa le chiavi <strong>test</strong> (<code>pk_test_</code> / <code>sk_test_</code>) in{' '}
            <code>.env.local</code>, oppure testa il pagamento sul sito in produzione (HTTPS).
          </Typography>
        </Alert>
      </Box>
    );
  }

  if (!stripeLoaded) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Caricamento sistema di pagamento...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Riepilogo ordine */}
      {(tipoGara || pastaPartyCount) && (
        <Card elevation={0} sx={{ mb: 3, p: 2, bgcolor: 'grey.50' }}>
          <Typography variant="subtitle2" gutterBottom fontWeight={600}>
            Riepilogo ordine:
          </Typography>
          {tipoGara && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">
                Iscrizione {getGaraDisplayName(tipoGara)}
              </Typography>
              <Typography variant="body2">
                €{getGaraPrice(tipoGara).toFixed(2)}
              </Typography>
            </Box>
          )}
          {pastaPartyCount && pastaPartyCount > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">
                Pasta Party ({pastaPartyCount} {pastaPartyCount === 1 ? 'persona' : 'persone'})
              </Typography>
              <Typography variant="body2">
                €{(pastaPartyCount * PRICING.pastaParty).toFixed(2)}
              </Typography>
            </Box>
          )}
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="subtitle2" fontWeight={600}>
              Totale
            </Typography>
            <Typography variant="subtitle2" fontWeight={600}>
              €{totalAmount.toFixed(2)}
            </Typography>
          </Box>
        </Card>
      )}
      
      <Elements
        stripe={getStripe()}
        options={{
          locale: 'it',
        }}
      >
        <PaymentForm 
          totalAmount={totalAmount}
          onSuccess={onSuccess}
          registrationId={registrationId}
          codiceRegistrazione={codiceRegistrazione}
          userEmail={userEmail}
          tipoGara={tipoGara}
          pastaPartyCount={pastaPartyCount}
        />
      </Elements>
    </Box>
  );
}