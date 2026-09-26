import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe-config';
import { sql } from '@vercel/postgres';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  try {
    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET is not set');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      const userId = parseInt(session.metadata?.userId || '0');

      if (!userId || !session.id) {
        console.error('Invalid session metadata:', session);
        return NextResponse.json({ error: 'Invalid metadata' }, { status: 400 });
      }

      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

      const orderItems = lineItems.data.map((item) => ({
        product_id: item.metadata?.productId,
        quantity: item.quantity,
        price: (item.amount_total || 0) / 100 / (item.quantity || 1),
      }));

      const totalPrice = (session.amount_total || 0) / 100;

      await sql`
        INSERT INTO orders (user_id, stripe_session_id, status, total_price, items)
        VALUES (${userId}, ${session.id}, 'completed', ${totalPrice}, ${JSON.stringify(orderItems)})
      `;

      console.log(`Order created for session ${session.id}, user ${userId}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);

    if (error instanceof Error) {
      if (error.message.includes('No matching signature found')) {
        return NextResponse.json(
          { error: 'Invalid signature' },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
