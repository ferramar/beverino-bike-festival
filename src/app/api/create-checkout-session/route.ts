import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { 
      registrationId, 
      includeCena, 
      numeroPersoneCena = 1,
      codiceRegistrazione,
      prezzoGara = 25,
      prezzoCena = 15
    } = body;

    // Validazione parametri
    if (!registrationId) {
      return NextResponse.json(
        { error: 'registrationId mancante' },
        { status: 400 }
      );
    }

    // Calcolo prezzo totale
    const prezzoTotale = includeCena 
      ? prezzoGara + (prezzoCena * numeroPersoneCena)
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
                ? `Beverino Bike Festival - Gara + Cena (${numeroPersoneCena} persone)`
                : 'Beverino Bike Festival - Solo Gara',
              description: 'Iscrizione al Beverino Bike Festival 2025'
            },
            unit_amount: prezzoTotale * 100, // Stripe usa centesimi
          },
          quantity: 1,
        },
      ],
      metadata: {
        registrationId: String(registrationId), // Usa String() invece di toString()
        ...(codiceRegistrazione && { codice_registrazione: codiceRegistrazione }), // Aggiungi solo se esiste
        includeCena: String(includeCena),
        numeroPersoneCena: String(numeroPersoneCena),
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