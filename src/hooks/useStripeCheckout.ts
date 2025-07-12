import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { log } from 'console';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export const useStripeCheckout = () => {
  const [loading, setLoading] = useState(false);

  const createCheckoutSession = async (
    registrationId: number,
    includeCena: boolean,
    numeroPersoneCena?: number,
    codiceRegistrazione?: string,
    tipo_gara?: 'ciclistica' | 'running' | ''
  ) => {
    setLoading(true);

    try {
      // Chiama API per creare sessione
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
          tipo_gara
        }),
      });

      const { sessionId } = await response.json();

      // Redirect a Stripe Checkout
      const stripe = await stripePromise;
      const { error } = await stripe!.redirectToCheckout({ sessionId });

      if (error) {
        console.error('Errore Stripe:', error);
      }
    } catch (error) {
      console.error('Errore checkout:', error);
    } finally {
      setLoading(false);
    }
  };

  return { createCheckoutSession, loading };
};