// src/hooks/useStripeCheckout.ts
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Dobbiamo ancora usare Stripe.js!
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

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
      // 1. Crea la sessione
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

      // 2. Usa l'URL se disponibile
      if (data.url) {
        window.location.href = data.url;
        return;
      }

      // 3. Altrimenti usa Stripe.js con il nuovo metodo
      if (data.sessionId) {
        const stripe = await stripePromise;
        if (!stripe) {
          throw new Error('Stripe non caricato');
        }

        // Secondo la documentazione, ora si usa questo approccio:
        // https://docs.stripe.com/js/deprecated/redirect_to_checkout
        const { error: stripeError } = await stripe.redirectToCheckout({
          sessionId: data.sessionId
        });
        
        if (stripeError) {
          throw stripeError;
        }
      } else {
        throw new Error('Né URL né sessionId disponibili');
      }
      
    } catch (error: any) {
      console.error('Errore checkout:', error);
      setError(error.message || 'Errore durante il checkout');
      setLoading(false);
      throw error;
    }
  };

  const clearError = () => setError(null);

  return { createCheckoutSession, loading, error, clearError };
};