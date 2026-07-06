import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { stripe } from '@/lib/stripe-server';
import { EVENT } from '@/config/event';
import { getGaraDisplayName } from '@/config/liberatorie';
import { calculateOrderTotalCents } from '@/config/pricing';

export async function POST(request: NextRequest) {
  try {
    const { amount, metadata, receipt_email } = await request.json();

    const tipoGara = metadata?.tipo_gara as string | undefined;
    const pastaPartyCount = parseInt(metadata?.pasta_party_count || '0', 10) || 0;

    if (tipoGara && (tipoGara === 'ciclistica' || tipoGara === 'running')) {
      const expectedAmount = calculateOrderTotalCents(tipoGara, pastaPartyCount);
      if (amount !== expectedAmount) {
        return NextResponse.json(
          { error: 'Importo non valido per la tariffa corrente' },
          { status: 400 }
        );
      }
    }

    let description = `Iscrizione Beverino Bike Festival ${EVENT.year}`;
    if (metadata.tipo_gara) {
      description += ` - ${getGaraDisplayName(metadata.tipo_gara)}`;
    }
    if (metadata.pasta_party_count && parseInt(metadata.pasta_party_count) > 0) {
      description += ` + Pasta Party (${metadata.pasta_party_count} persone)`;
    }

    const paymentIntentData: Stripe.PaymentIntentCreateParams = {
      amount,
      currency: 'eur',
      metadata,
      description,
      automatic_payment_methods: {
        enabled: true,
      },
      ...(receipt_email ? { receipt_email } : {}),
    };

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
