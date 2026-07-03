import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe-server';
import { EVENT } from '@/config/event';

export async function POST(request: NextRequest) {
  try {
    const { amount, metadata, receipt_email } = await request.json();

    // Crea una descrizione dettagliata per la ricevuta
    let description = `Iscrizione Beverino Bike Festival ${EVENT.year}`;
    if (metadata.tipo_gara) {
      description += ` - Gara ${metadata.tipo_gara === 'ciclistica' ? 'Ciclistica' : 'Running'}`;
    }
    if (metadata.pasta_party_count && parseInt(metadata.pasta_party_count) > 0) {
      description += ` + Pasta Party (${metadata.pasta_party_count} persone)`;
    }

    const paymentIntentData: any = {
      amount,
      currency: 'eur',
      metadata,
      description, // Descrizione che apparirà nella ricevuta
      automatic_payment_methods: {
        enabled: true,
      },
    };

    // Aggiungi email se fornita
    if (receipt_email) {
      paymentIntentData.receipt_email = receipt_email;
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentData);

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Errore creazione payment intent:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}