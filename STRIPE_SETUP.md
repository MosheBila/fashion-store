# Stripe Payment Integration Setup

This guide explains how to set up Stripe for payment processing in the fashion store.

## Prerequisites

1. A Stripe account (create at https://stripe.com)
2. Test mode API keys from your Stripe dashboard

## Environment Variables

Add these variables to your `.env.local` file:

```
# Stripe API Keys (get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_...your_secret_key...
STRIPE_PUBLISHABLE_KEY=pk_test_...your_publishable_key...

# Webhook endpoint secret (set up after deploying)
STRIPE_WEBHOOK_SECRET=whsec_...your_webhook_secret...
```

## Configuration Steps

### 1. Get Your API Keys

1. Log in to your Stripe Dashboard
2. Go to Developers → API Keys
3. Copy your Secret Key (starts with `sk_test_` or `sk_live_`)
4. Copy your Publishable Key (starts with `pk_test_` or `pk_live_`)
5. Add these to `.env.local`

### 2. Testing with Stripe

Use these test card numbers when in test mode:

- **Visa**: `4242 4242 4242 4242`
- **Visa (Decline)**: `4000 0000 0000 0002`
- **Mastercard**: `5555 5555 5555 4444`
- Use any future date for expiry (e.g., 12/25)
- Use any 3-digit number for CVC

### 3. Webhook Setup (Production Only)

For production deployment:

1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select event: `checkout.session.completed`
4. Copy the signing secret and add to `.env.local` as `STRIPE_WEBHOOK_SECRET`

## How It Works

### Checkout Flow

1. User adds items to cart at `/shop/cart`
2. User clicks "Proceed to Checkout"
3. Frontend calls `/api/checkout` with cart items and JWT token
4. Backend creates Stripe checkout session
5. User is redirected to Stripe Checkout page
6. User enters payment details and completes payment

### Payment Processing

1. Stripe processes payment and sends webhook
2. `/api/webhooks/stripe` receives `checkout.session.completed` event
3. Order is created in database with status `completed`
4. User is redirected to `/shop/order-success` with session ID
5. Cart is cleared on success

### Error Handling

- **Payment Declined**: User is redirected to `/shop/order-cancel`
- **Missing Authentication**: User is redirected to `/auth/login`
- **Invalid Checkout**: Error message displayed in cart page

## Database Integration

Orders are stored with:

- `user_id`: Customer ID
- `stripe_session_id`: Stripe session reference
- `status`: `completed` or `pending`
- `total_price`: Order total in USD
- `items`: JSON array of ordered products

## Testing Locally

To test webhooks locally, use Stripe CLI:

```bash
# Install Stripe CLI (https://stripe.com/docs/stripe-cli)

# Forward webhooks to local environment
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# This will give you a webhook signing secret to add to .env.local
```

## Security Notes

- **Never commit** API keys to version control
- **Use environment variables** for all keys
- **Webhook secret** must be kept secure
- **Always verify** webhook signatures on the backend
- **Use HTTPS** in production

## Transitioning to Live Mode

1. Switch to Live API Keys in Stripe Dashboard
2. Update `.env.local` with live keys (sk_live_*, pk_live_*)
3. Ensure webhook endpoint is HTTPS
4. Test with small amounts before going live
5. Update webhook secret for production

## Troubleshooting

### "STRIPE_SECRET_KEY is not set"
- Check `.env.local` file exists
- Verify `STRIPE_SECRET_KEY` is defined
- Restart dev server after adding variables

### Webhook not receiving events
- Ensure endpoint URL is publicly accessible
- Check webhook signing secret is correct
- Verify event type is selected (checkout.session.completed)
- Use Stripe Dashboard → Webhooks → Logs to debug

### Payment session not created
- Verify user is authenticated (check JWT token)
- Ensure cart has items
- Check Stripe API keys are valid
- Review server logs for detailed errors

## Documentation References

- [Stripe Checkout Documentation](https://stripe.com/docs/checkout)
- [Stripe Webhooks](https://stripe.com/docs/webhooks)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe API Reference](https://stripe.com/docs/api)
