// src/lib/stripe.ts
import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    
    if (!key) {
      console.error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY non configurata');
      throw new Error('Stripe key mancante');
    }
    
    console.log('Inizializzazione Stripe con chiave:', key.substring(0, 20) + '...');
    stripePromise = loadStripe(key);
  }
  
  return stripePromise;
};