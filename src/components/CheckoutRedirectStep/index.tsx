'use client';

import React, { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Typography,
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import { PRICING } from '../../config/event';
import { getGaraPrice } from '../../config/pricing';
import { getGaraDisplayName } from '../../config/liberatorie';

interface CheckoutRedirectStepProps {
  totalAmount: number;
  registrationId: number;
  codiceRegistrazione: string;
  tipoGara?: string;
  pastaPartyCount?: number;
}

export default function CheckoutRedirectStep({
  totalAmount,
  registrationId,
  codiceRegistrazione,
  tipoGara,
  pastaPartyCount = 0,
}: CheckoutRedirectStepProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePay = async () => {
    if (!tipoGara) {
      setError('Seleziona una gara prima di procedere al pagamento.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationId: String(registrationId),
          tipo_gara: tipoGara,
          includeCena: pastaPartyCount > 0,
          numeroPersoneCena: pastaPartyCount,
          codiceRegistrazione,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Errore durante la creazione del pagamento');
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error('URL di pagamento non disponibile');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Si è verificato un errore. Riprova.';
      setError(message);
      setLoading(false);
    }
  };

  return (
    <Box>
      <Card elevation={0} sx={{ mb: 3, p: 2, bgcolor: 'grey.50' }}>
        <Typography variant="subtitle2" gutterBottom fontWeight={600}>
          Riepilogo ordine
        </Typography>
        {tipoGara && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">
              Iscrizione {getGaraDisplayName(tipoGara)}
            </Typography>
            <Typography variant="body2">€{getGaraPrice(tipoGara).toFixed(2)}</Typography>
          </Box>
        )}
        {pastaPartyCount > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2">
              Pasta Party ({pastaPartyCount}{' '}
              {pastaPartyCount === 1 ? 'persona' : 'persone'})
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

      <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LockIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="h6">Pagamento sicuro</Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Verrai reindirizzato alla pagina protetta di Stripe per inserire i dati della carta.
            Al termine tornerai automaticamente sul sito con la conferma dell&apos;iscrizione.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Button
            variant="contained"
            fullWidth
            size="large"
            disabled={loading || totalAmount <= 0}
            onClick={handlePay}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : undefined}
          >
            {loading ? 'Reindirizzamento a Stripe...' : `Paga €${totalAmount.toFixed(2)}`}
          </Button>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 2, display: 'block', textAlign: 'center' }}
          >
            Pagamento gestito da Stripe. Non serve caricare moduli aggiuntivi nel browser.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
