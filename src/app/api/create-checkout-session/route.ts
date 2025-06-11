import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export async function POST(request: NextRequest) {
  try {
    const { 
      registrationId, 
      includeCena, 
      numeroPerssoneCena = 1,
      prezzoGara = 25, // Imposta i tuoi prezzi
      prezzoCena = 15  // Imposta i tuoi prezzi
    } = await request.json();

    // Calcolo prezzo totale
    const prezzoTotale = includeCena 
      ? prezzoGara + (prezzoCena * numeroPerssoneCena)
      : prezzoGara;

    // Creazione sessione Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: includeCena 
                ? `Beverino Bike Festival - Gara + Cena (${numeroPerssoneCena} persone)`
                : 'Beverino Bike Festival - Solo Gara',
              description: 'Iscrizione al Beverino Bike Festival 2025'
            },
            unit_amount: prezzoTotale * 100, // Stripe usa centesimi
          },
          quantity: 1,
        },
      ],
      metadata: {
        registrationId: registrationId.toString(),
        includeCena: includeCena.toString(),
        numeroPerssoneCena: numeroPerssoneCena.toString(),
      },
      success_url: `${request.nextUrl.origin}/conferma?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/iscriviti?step=3`,
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error('Errore creazione sessione Stripe:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}