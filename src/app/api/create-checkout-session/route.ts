// src/app/api/create-checkout-session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

interface CheckoutData {
  registrationId: string;
  nome: string;
  cognome: string;
  email: string;
  tipo_gara: 'ciclistica' | 'running';
  conteggio_pastaparty: number;
  codiceRegistrazione?: string;
  includeCena?: boolean;
  numeroPersoneCena?: number;
  prezzoCena?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutData = await request.json();

    const { 
      registrationId, 
      includeCena, 
      numeroPersoneCena = 0,
      codiceRegistrazione,
      prezzoCena = 15,
      tipo_gara,
    } = body;
    
    // Validazione
    if (!registrationId) {
      return NextResponse.json(
        { error: 'registrationId mancante' },
        { status: 400 }
      );
    }

    if (!tipo_gara || (tipo_gara !== 'ciclistica' && tipo_gara !== 'running')) {
      return NextResponse.json(
        { error: 'Tipo di gara non valido' },
        { status: 400 }
      );
    }

    // Calcola il prezzo in base al tipo di gara
    const prezzoGara = tipo_gara === 'ciclistica' ? 2500 : 1000; // €25 o €10 in centesimi

    const prezzoTotale = numeroPersoneCena > 0 
      ? prezzoGara + (1200 * numeroPersoneCena)
      : prezzoGara;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      ui_mode: 'hosted',
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
            unit_amount: prezzoTotale, // Stripe usa centesimi
          },
          quantity: 1,
        },
      ],
      metadata: {
        registrationId: String(registrationId),
        ...(codiceRegistrazione && { codice_registrazione: codiceRegistrazione }),
        includeCena: String(includeCena),
        numeroPersoneCena: String(numeroPersoneCena),
      },
      success_url: `${request.nextUrl.origin}/conferma?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/iscriviti?step=3`,
    });

    // IMPORTANTE: Restituisci l'URL invece del sessionId
    // Questo evita la necessità di caricare Stripe.js lato client
    return NextResponse.json({ 
      url: session.url,  // URL diretto per il checkout
      sessionId: session.id  // Mantieni per compatibilità
    });
    
  } catch (error) {
    console.error('Errore creazione sessione Stripe:', error);
    return NextResponse.json(
      { error: 'Errore durante la creazione della sessione di pagamento' },
      { status: 500 }
    );
  }
}