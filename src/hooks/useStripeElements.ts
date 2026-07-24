// src/hooks/useStripeElements.ts
import { useEffect, useState } from 'react';
import type { Stripe, StripeElements } from '@stripe/stripe-js';
import { getStripe } from '../lib/stripe';

export const useStripeElements = () => {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [elements, setElements] = useState<StripeElements | null>(null);

  useEffect(() => {
    let cancelled = false;

    getStripe().then((instance) => {
      if (cancelled || !instance) return;
      setStripe(instance);
      setElements(instance.elements());
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { stripe, elements };
};
