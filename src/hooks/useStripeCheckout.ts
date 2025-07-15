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
    
    // Detecta se siamo su Windows
    const isWindows = typeof window !== 'undefined' && navigator.platform.toLowerCase().includes('win');
    
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
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Errore del server (${response.status})`);
        }

        const { sessionId } = await response.json();
        
        if (!sessionId) {
          throw new Error('Sessione di pagamento non valida');
        }

        // USA SEMPRE il metodo ufficiale di Stripe
        const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });
        
        if (stripeError) {
          console.error('Errore Stripe:', stripeError);
          
          // Se siamo su Windows e non è l'ultimo tentativo, riprova
          if (isWindows && attempt < maxRetries) {
            throw new Error('Redirect bloccato, riprovo...');
          }
          
          // Altrimenti, genera un errore user-friendly
          let errorMessage = stripeError.message;
          
          if (isWindows) {
            errorMessage += '\n\nSoluzioni per Windows:\n';
            errorMessage += '• Disabilita temporaneamente il blocco popup\n';
            errorMessage += '• Tieni premuto CTRL mentre clicchi "Conferma e Paga"\n';
            errorMessage += '• Prova con Chrome o Firefox\n';
            errorMessage += '• Disabilita temporaneamente antivirus/firewall';
          }
          
          throw new Error(errorMessage);
        }
        
        // Se arriviamo qui, il redirect è riuscito
        setRetryCount(0);
        setError(null);
        setLoading(false);
        return;
        
      } catch (err: any) {
        lastError = err;
        console.error(`Errore tentativo ${attempt + 1}:`, err.message);
        
        // Se non è l'ultimo tentativo, continua il loop
        if (attempt < maxRetries) {
          setError(`${err.message}`);
          continue;
        }
      }
    }
    
    // Se arriviamo qui, tutti i tentativi sono falliti
    const finalError = lastError?.message || 'Impossibile procedere al pagamento dopo multipli tentativi';
    setError(finalError);
    setLoading(false);
    setRetryCount(retryCount + 1);
    
    // Aggiungi un messaggio di fallback per Windows
    if (isWindows && retryCount === 0) {
      setError(finalError + '\n\nProva a copiare questo link e incollarlo in una nuova scheda del browser.');
    }
    
    throw lastError;
  };

  const clearError = () => {
    setError(null);
  };

  return { createCheckoutSession, loading, error, clearError, retryCount };
};