// src/app/api/create-checkout-session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe-server';
import { EVENT } from '@/config/event';
import { calculateOrderTotalCents } from '@/config/pricing';
import { getGaraDisplayName } from '@/config/liberatorie';

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

    const prezzoTotale = calculateOrderTotalCents(
      tipo_gara,
      includeCena ? numeroPersoneCena : 0
    );

    const garaLabel = getGaraDisplayName(tipo_gara);
    const pastaCount = includeCena ? numeroPersoneCena : 0;
    const productName =
      pastaCount > 0
        ? `${garaLabel} + Pasta Party (${pastaCount} ${pastaCount === 1 ? 'persona' : 'persone'})`
        : garaLabel;

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      ui_mode: 'hosted',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: productName,
              description: `Iscrizione — Beverino Bike Festival ${EVENT.year}`,
            },
            unit_amount: prezzoTotale,
          },
          quantity: 1,
        },
      ],
      metadata: {
        registrationId: String(registrationId),
        codice_registrazione: codiceRegistrazione || '',
        tipo_gara,
        includeCena: String(!!includeCena),
        numeroPersoneCena: String(numeroPersoneCena),
      },
      success_url: `${request.nextUrl.origin}/conferma?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/iscriviti`,
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