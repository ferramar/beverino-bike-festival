// src/hooks/useStripeCheckout.ts
import { useState } from 'react';
import { getStripe } from '../lib/stripe';

export const useStripeCheckout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCheckoutSession = async (
    registrationId: number,
    includeCena: boolean,
    numeroPersoneCena?: number,
    codiceRegistrazione?: string,
    tipo_gara?: 'ciclistica' | 'running' | ''
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          registrationId,
          includeCena,
          numeroPersoneCena,
          codiceRegistrazione,
          tipo_gara,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Errore creazione sessione');
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      if (data.sessionId) {
        const stripe = await getStripe();

        if (!stripe) {
          const fallbackUrl = `https://checkout.stripe.com/c/pay/${data.sessionId}`;
          window.location.href = fallbackUrl;
          return;
        }

        const { error: stripeError } = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });

        if (stripeError) {
          throw stripeError;
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Errore durante il checkout';
      console.error('Errore checkout:', err);
      setError(message);
      setLoading(false);
      throw err;
    }
  };

  return {
    createCheckoutSession,
    loading,
    error,
    clearError: () => setError(null),
  };
};
