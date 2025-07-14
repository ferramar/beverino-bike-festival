// src/hooks/useStripeCheckout.ts
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export const useStripeCheckout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const createCheckoutSession = async (
    registrationId: number,
    includeCena: boolean,
    numeroPersoneCena?: number,
    codiceRegistrazione?: string,
    tipo_gara?: 'ciclistica' | 'running' | ''
  ) => {
    setLoading(true);
    setError(null);
    
    const maxRetries = 2;
    let lastError: any;
    
    // Tenta fino a maxRetries volte
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          // Aspetta un po' tra i tentativi (1s, 2s, 3s...)
          await new Promise(resolve => setTimeout(resolve, attempt * 1000));
          console.log(`Tentativo ${attempt + 1} di ${maxRetries + 1}...`);
          setError(`Tentativo ${attempt + 1} di ${maxRetries + 1}...`);
        }

        // Verifica che Stripe sia caricato
        const stripe = await stripePromise;
        if (!stripe) {
          throw new Error('Impossibile caricare il sistema di pagamento');
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
          throw new Error(`Errore del server (${response.status})`);
        }

        const { sessionId } = await response.json();
        
        if (!sessionId) {
          throw new Error('Sessione di pagamento non valida');
        }

        // Prova redirect con gestione speciale per popup bloccati
        let redirectResult;
        
        // Metodo 1: Redirect standard
        redirectResult = await stripe.redirectToCheckout({ sessionId });
        
        if (redirectResult?.error) {
          // Se il popup è bloccato o c'è un errore, prova metodo alternativo
          if (attempt < maxRetries) {
            console.log('Redirect fallito, provo metodo alternativo...');
            
            // Metodo 2: Apri in nuova finestra
            const checkoutUrl = `https://checkout.stripe.com/pay/${sessionId}`;
            const newWindow = window.open(checkoutUrl, '_blank');
            
            if (newWindow) {
              setLoading(false);
              setError(null);
              return; // Successo con metodo alternativo
            } else {
              // Metodo 3: Redirect nella stessa finestra (ultimo tentativo)
              if (attempt === maxRetries - 1) {
                window.location.href = checkoutUrl;
                return;
              }
            }
          }
          
          throw new Error(redirectResult.error.message);
        }
        
        // Se arriviamo qui, il redirect è riuscito
        setRetryCount(0);
        setError(null);
        return;
        
      } catch (err: any) {
        lastError = err;
        console.error(`Errore tentativo ${attempt + 1}:`, err.message);
        
        // Se non è l'ultimo tentativo, continua il loop
        if (attempt < maxRetries) {
          setError(`Errore: ${err.message}. Riprovo...`);
          continue;
        }
      }
    }
    
    // Se arriviamo qui, tutti i tentativi sono falliti
    setError(lastError?.message || 'Impossibile procedere al pagamento dopo multipli tentativi');
    setLoading(false);
    setRetryCount(retryCount + 1);
    throw lastError;
  };

  const clearError = () => {
    setError(null);
  };

  return { createCheckoutSession, loading, error, clearError, retryCount };
};