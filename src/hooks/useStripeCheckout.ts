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
    
    // Pre-apri una finestra su Windows per evitare blocco popup
    let checkoutWindow: Window | null = null;
    if (isWindows) {
      checkoutWindow = window.open('', '_blank');
      if (checkoutWindow) {
        // Mostra un messaggio di caricamento nella finestra
        checkoutWindow.document.write(`
          <html>
            <head>
              <title>Reindirizzamento al pagamento...</title>
              <style>
                body { 
                  font-family: Arial, sans-serif; 
                  display: flex; 
                  justify-content: center; 
                  align-items: center; 
                  height: 100vh; 
                  margin: 0;
                  background-color: #f5f5f5;
                }
                .loader { 
                  text-align: center; 
                }
                .spinner {
                  border: 4px solid #f3f3f3;
                  border-top: 4px solid #A52D0C;
                  border-radius: 50%;
                  width: 40px;
                  height: 40px;
                  animation: spin 1s linear infinite;
                  margin: 0 auto 20px;
                }
                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
              </style>
            </head>
            <body>
              <div class="loader">
                <div class="spinner"></div>
                <h2>Reindirizzamento al pagamento sicuro...</h2>
                <p>Attendi qualche secondo</p>
              </div>
            </body>
          </html>
        `);
      }
    }
    
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

        // URL di checkout
        const checkoutUrl = `https://checkout.stripe.com/c/pay/${sessionId}`;

        // Se abbiamo pre-aperto una finestra su Windows, usala
        if (checkoutWindow && !checkoutWindow.closed) {
          checkoutWindow.location.href = checkoutUrl;
          setLoading(false);
          setError(null);
          return;
        }

        // Altrimenti usa i metodi standard
        try {
          // Prova prima il redirect standard di Stripe
          const redirectResult = await stripe.redirectToCheckout({ sessionId });
          
          if (redirectResult?.error) {
            throw new Error(redirectResult.error.message);
          }
        } catch (stripeError: any) {
          console.log('Redirect Stripe fallito, provo metodi alternativi...');
          
          // Metodo 2: window.open
          const newWindow = window.open(checkoutUrl, '_blank');
          if (newWindow) {
            setLoading(false);
            setError(null);
            return;
          }
          
          // Metodo 3: Form submit (funziona meglio su alcuni browser Windows)
          if (isWindows) {
            const form = document.createElement('form');
            form.method = 'GET';
            form.action = checkoutUrl;
            form.target = '_blank';
            
            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
            
            setLoading(false);
            setError(null);
            return;
          }
          
          // Metodo 4: Redirect nella stessa finestra (ultimo tentativo)
          if (attempt === maxRetries) {
            window.location.href = checkoutUrl;
            return;
          }
          
          throw stripeError;
        }
        
        // Se arriviamo qui, il redirect è riuscito
        setRetryCount(0);
        setError(null);
        return;
        
      } catch (err: any) {
        lastError = err;
        console.error(`Errore tentativo ${attempt + 1}:`, err.message);
        
        // Se abbiamo una finestra pre-aperta e c'è stato un errore, chiudila
        if (checkoutWindow && !checkoutWindow.closed && attempt === maxRetries) {
          checkoutWindow.close();
        }
        
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