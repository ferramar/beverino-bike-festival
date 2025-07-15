// src/hooks/useStripeElements.ts
import { useState } from 'react';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export const useStripeElements = () => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [elements, setElements] = useState<StripeElements | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initializeStripe = async () => {
    const stripeInstance = await stripePromise;
    if (stripeInstance) {
      setStripe(stripeInstance);
      const elementsInstance = stripeInstance.elements();
      setElements(elementsInstance);
    }
  };

  const createPaymentIntent = async (amount: number, metadata: any) => {
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, metadata }),
      });
      
      const data = await response.json();
      return data.clientSecret;
    } catch (err) {
      setError('Errore creazione payment intent');
      throw err;
    }
  };

  const confirmPayment = async (clientSecret: string, cardElement: any) => {
    if (!stripe || !elements) {
      throw new Error('Stripe non inizializzato');
    }

    setLoading(true);
    setError(null);

    try {
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (confirmError) {
        throw confirmError;
      }

      return paymentIntent;
    } catch (err: any) {
      setError(err.message || 'Errore pagamento');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    stripe,
    elements,
    loading,
    error,
    initializeStripe,
    createPaymentIntent,
    confirmPayment,
  };
};