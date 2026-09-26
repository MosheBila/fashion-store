import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.warn('Stripe secret key is not set in environment variables');
}

export const stripe = new Stripe(stripeSecretKey || '', {
  apiVersion: '2024-04-10' as any,
});

/**
 * Create a Stripe checkout session from cart items
 */
export async function createCheckoutSession(
  items: Array<{
    productId: number;
    quantity: number;
    price: number;
    name: string;
  }>,
  successUrl: string,
  cancelUrl: string
) {
  try {
    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          metadata: {
            productId: item.productId.toString(),
          },
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems as Stripe.Checkout.SessionCreateParams.LineItem[],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return session;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

/**
 * Retrieve a Stripe checkout session
 */
export async function getCheckoutSession(sessionId: string) {
  try {
    return await stripe.checkout.sessions.retrieve(sessionId);
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    throw error;
  }
}
