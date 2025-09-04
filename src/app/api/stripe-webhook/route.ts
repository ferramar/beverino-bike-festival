import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const { registrationId } = session.metadata!;

    // Aggiorna Strapi
    try {
      await fetch(`${process.env.STRAPI_API_URL}/iscrizioni/${registrationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
        body: JSON.stringify({
          data: {
            stato_pagamento: 'completato',
            id_pagamento: session.payment_intent,
          }
        }),
      });
    } catch (error) {
      console.error('Errore aggiornamento Strapi:', error);
    }
  }

  return NextResponse.json({ received: true });
}
