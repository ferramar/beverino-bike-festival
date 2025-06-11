import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID mancante' }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    return NextResponse.json({
      status: session.status,
      payment_status: session.payment_status,
      payment_intent: session.payment_intent,
      amount_total: session.amount_total,
      currency: session.currency,
    });
  } catch (error) {
    console.error('Errore verifica pagamento:', error);
    return NextResponse.json({ error: 'Errore verifica pagamento' }, { status: 500 });
  }
}