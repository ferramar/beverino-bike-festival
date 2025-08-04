// src/hooks/useStripeCheckout.ts
import { useState, useEffect } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';

// Carica Stripe con error handling migliorato
let stripePromise: Promise<Stripe | null>;

const getStripe = () => {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    
    if (!key) {
      console.error('Stripe key mancante!');
      return Promise.resolve(null);
    }
    
    stripePromise = loadStripe(key).catch((error) => {
      console.error('Errore caricamento Stripe:', error);
      return null;
    });
  }
  
  return stripePromise;
};

export const useStripeCheckout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stripeLoaded, setStripeLoaded] = useState(false);

  useEffect(() => {
    // Pre-carica Stripe
    getStripe().then((stripe) => {
      setStripeLoaded(!!stripe);
      if (!stripe) {
        setError('Impossibile caricare Stripe');
      }
    });
  }, []);

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
      // Crea la sessione
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

      // Usa URL diretto (metodo preferito)
      if (data.url) {
        window.location.href = data.url;
        return;
      }

      // Fallback a sessionId
      if (data.sessionId) {
        const stripe = await getStripe();
        
        if (!stripe) {
          // Se Stripe non si carica, usa URL di fallback
          const fallbackUrl = `https://checkout.stripe.com/c/pay/${data.sessionId}`;
          window.location.href = fallbackUrl;
          return;
        }
        
        const { error: stripeError } = await stripe.redirectToCheckout({
          sessionId: data.sessionId
        });
        
        if (stripeError) {
          throw stripeError;
        }
      }
      
    } catch (error: any) {
      console.error('Errore checkout:', error);
      setError(error.message || 'Errore durante il checkout');
      setLoading(false);
      throw error;
    }
  };

  return { 
    createCheckoutSession, 
    loading, 
    error, 
    stripeLoaded,
    clearError: () => setError(null) 
  };
};