// src/lib/stripe-server.ts
// Client Stripe lato server condiviso da tutte le API route.
// Centralizza chiave segreta e apiVersion in un unico punto.
import Stripe from "stripe";

/** Versione dell'API Stripe usata in tutto il backend. */
export const STRIPE_API_VERSION = "2025-08-27.basil" as const;

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: STRIPE_API_VERSION,
});
