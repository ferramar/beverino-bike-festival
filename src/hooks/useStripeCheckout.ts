// src/hooks/useStripeCheckout.ts
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

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
      // Verifica che Stripe sia caricato
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Impossibile caricare il sistema di pagamento. Riprova oppure contattaci ad uno dei numeri presenti in fondo alla pagina.');
      }

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
          tipo_gara,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Errore del server (${response.status})`);
      }

      const { sessionId } = await response.json();
      
      if (!sessionId) {
        throw new Error('Sessione di pagamento non valida');
      }

      // Redirect a Stripe Checkout
      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });
      
      if (stripeError) {
        console.error('Errore Stripe:', stripeError);
        throw new Error(stripeError.message || 'Errore durante il reindirizzamento al pagamento');
      }
    } catch (error: any) {
      console.error('Errore checkout:', error);
      setError(error.message || 'Si è verificato un errore. Riprova.');
      setLoading(false);
      
      // Ritorna l'errore così il componente può gestirlo
      throw error;
    }
  };

  const clearError = () => setError(null);

  return { createCheckoutSession, loading, error, clearError };
};