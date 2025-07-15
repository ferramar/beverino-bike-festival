// src/hooks/useStripeCheckout.ts
import { useState } from 'react';

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
        throw new Error(data.error || 'Errore creazione sessione di pagamento');
      }

      if (!data.url) {
        throw new Error('URL di checkout non disponibile');
      }

      // Redirect diretto all'URL di Stripe
      window.location.href = data.url;
      
      // Il loading rimane true perché stiamo per lasciare la pagina
      
    } catch (error: any) {
      console.error('Errore checkout:', error);
      setError(error.message || 'Si è verificato un errore durante il checkout');
      setLoading(false);
      throw error;
    }
  };

  const clearError = () => setError(null);

  return { createCheckoutSession, loading, error, clearError };
};