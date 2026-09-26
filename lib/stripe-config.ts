import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY environment variable is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-15.acpi',
});

export async function createCheckoutSession(
  items: Array<{ id: number; name: string; price: number; quantity: number }>,
  userId: number,
  baseUrl: string
) {
  const lineItems = items.map((item) => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
        metadata: {
          productId: item.id.toString(),
        },
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${baseUrl}/shop/order-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/shop/order-cancel`,
    metadata: {
      userId: userId.toString(),
    },
  });

  return session;
}
