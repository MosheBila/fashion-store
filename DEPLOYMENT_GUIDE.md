# Vercel Deployment Guide — Phase 10

Complete step-by-step guide to deploy the fashion e-store to Vercel.

## Status: Phases 1-9 Complete

This deployment includes all features:
- ✅ Database with 4 tables (users, products, categories, orders)
- ✅ JWT authentication with admin panel
- ✅ Cloudinary image upload and CDN
- ✅ Complete products/categories API
- ✅ Customer storefront (browse, search, filter)
- ✅ Shopping cart with localStorage
- ✅ Stripe payment integration
- ✅ Webhook order processing

## Prerequisites

- GitHub account (free at github.com)
- Vercel account (free at vercel.com)
- Cloudinary account with API credentials
- Stripe account (test mode initially)
- All code committed locally (ready to push)
- Node.js and git installed locally

## Step 1: Push Code to GitHub

```bash
cd C:\Users\User\OneDrive\מסמכים\fashion-store

# If not initialized
git init
git remote add origin https://github.com/YOUR_USERNAME/fashion-store.git

# Add all files
git add -A
git commit -m "feat: fashion e-store complete with phases 1-5"

# Push to GitHub
git push -u origin main
```

## Step 2: Connect Vercel to GitHub

1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Click **"Import Git Repository"**
4. Paste your GitHub repo URL:
   ```
   https://github.com/YOUR_USERNAME/fashion-store.git
   ```
5. Click **"Import"**

## Step 3: Configure Project

Vercel will show the project settings:

1. **Framework Preset**: Select **"Next.js"** ✓ (auto-detected)
2. **Root Directory**: Leave as **"."** ✓
3. **Environment Variables**: Click **"Add"** (next step)

## Step 4: Add Environment Variables

In Vercel Dashboard, add these one by one:

### Database
```
POSTGRES_URLCONNECT = postgresql://user:password@host:5432/database
```

Get from:
1. Go to [vercel.com](https://vercel.com) → **Storage**
2. Create **Postgres** database (select region)
3. Copy the connection string

### Cloudinary
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = your_cloud_name
CLOUDINARY_API_KEY = your_api_key
CLOUDINARY_API_SECRET = your_api_secret
```

Get from:
1. Go to [cloudinary.com](https://cloudinary.com) → **Dashboard**
2. Go to **Account Details** → **API Keys**
3. Copy credentials

### Stripe (Test Mode)
```
STRIPE_SECRET_KEY = sk_test_...
STRIPE_PUBLISHABLE_KEY = pk_test_...
STRIPE_WEBHOOK_SECRET = whsec_... (configured after deployment)
```

Get from:
1. Go to [stripe.com](https://stripe.com) → **Developers** → **API Keys**
2. Copy **Secret Key** (starts with `sk_test_`)
3. Copy **Publishable Key** (starts with `pk_test_`)
4. Webhook secret will be generated after setting up webhook endpoint

**Note on Webhook Secret:**
- After initial deployment, Stripe webhook will be at: `https://your-app.vercel.app/api/webhooks/stripe`
- Set it up in Stripe Dashboard → Webhooks → Add endpoint
- Copy the signing secret and add to Vercel environment variables

### JWT Secret
```
JWT_SECRET = your-super-secret-key-32-chars-random
```

Generate a random secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### App URL
```
NEXT_PUBLIC_APP_URL = https://your-app.vercel.app
```

Replace with your actual Vercel domain (assigned after deploy).

## Step 5: Deploy

1. Click **"Deploy"** button
2. Wait for deployment to complete (3-5 minutes)
3. Get your live URL: `https://your-app.vercel.app`

## Step 6: Run Database Migrations

After deployment, run migrations on Vercel Postgres:

### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Run migrations
vercel env pull  # Pulls .env.local from Vercel
npm run migrate
```

### Option B: Using Vercel Dashboard

1. Go to Vercel Dashboard → Your Project → **Storage** → **Postgres**
2. Click **"Query Database"**
3. Paste SQL from `scripts/001_create_tables.sql`:
   ```sql
   CREATE TABLE IF NOT EXISTS categories (
     id SERIAL PRIMARY KEY,
     name VARCHAR(255) NOT NULL UNIQUE,
     ...
   );
   ```

### Option C: From Local Machine

```bash
# Update .env.local with POSTGRES_URLCONNECT from Vercel
POSTGRES_URLCONNECT=postgresql://...

# Run migrations locally (they'll hit Vercel's database)
npm run migrate
```

## Step 7: Verify Deployment

Visit your live site:

```
https://your-app.vercel.app
```

✅ **Check:**
- [ ] Landing page loads (home)
- [ ] Can navigate to `/auth/login`
- [ ] Login form appears
- [ ] Try logging in (may fail if DB not migrated - expected)
- [ ] After DB migration, login should work
- [ ] `/admin` redirects to login (good)
- [ ] `/admin/upload-test` redirects to login (good)

## Step 8: Configure Stripe Webhook (CRITICAL FOR PAYMENTS)

Before testing payments, set up the webhook:

1. Go to [stripe.com](https://stripe.com) → **Developers** → **Webhooks**
2. Click **"Add Endpoint"**
3. Enter endpoint URL:
   ```
   https://your-app.vercel.app/api/webhooks/stripe
   ```
   (Replace with your actual Vercel domain)
4. Select events: Check **"checkout.session.completed"**
5. Click **"Add Endpoint"**
6. Copy the **Signing Secret** (starts with `whsec_`)
7. Go to Vercel Dashboard → Settings → Environment Variables
8. Add new variable:
   ```
   STRIPE_WEBHOOK_SECRET = whsec_...
   ```
9. Deploy again (push to GitHub or redeploy in Vercel)

**Why this matters:** Without the webhook secret, payments won't create orders in the database.

## Step 9: Test Full Flow

After migrations and webhook setup are complete:

### 1. Register/Login (Admin)
```
Go to: https://your-app.vercel.app/auth/login
Email: admin@example.com
Password: password123
```

### 2. Create Products (Admin)
- Navigate to `/admin/products`
- Add a category first
- Create 2-3 products with images
- Set prices ($50-150) and stock quantities

### 3. Test Customer Storefront
```
Go to: https://your-app.vercel.app/shop
- See all products in grid
- Search by name
- Filter by category
- Click product for details
- View sizes and pricing
```

### 4. Test Shopping Cart
- Add products to cart (different quantities)
- Update quantities in cart
- See order summary (subtotal, tax 10%, shipping)
- Verify free shipping on $100+

### 5. Test Payment Flow ⭐ CRITICAL
```
Go to: https://your-app.vercel.app/shop/cart
Click "Proceed to Checkout"
→ Redirected to Stripe payment page
→ Use test card: 4242 4242 4242 4242
→ Expiry: 12/25 (any future date)
→ CVC: 123 (any 3 digits)
→ Name: Any name
→ Click "Pay"
→ Should see /shop/order-success with order number
```

### 6. Verify Order in Database
```
Vercel Dashboard → Storage → Postgres → Query Database
SELECT * FROM orders;
```
Should show the order with status = 'completed'

### 7. Verify Webhook Was Called
```
Stripe Dashboard → Developers → Webhooks → [Your endpoint]
Click to see events
Should show "checkout.session.completed" with status "Succeeded"
```

## Environment Variables Checklist

```
✅ POSTGRES_URLCONNECT (database)
✅ NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
✅ CLOUDINARY_API_KEY
✅ CLOUDINARY_API_SECRET
✅ STRIPE_SECRET_KEY (test mode initially)
✅ STRIPE_PUBLISHABLE_KEY (test mode initially)
✅ STRIPE_WEBHOOK_SECRET (set after webhook configured)
✅ JWT_SECRET
✅ NEXT_PUBLIC_APP_URL
```

**Total: 9 environment variables** (STRIPE_WEBHOOK_SECRET can be added later)

## Troubleshooting

### "Database Connection Error"
- Check `POSTGRES_URLCONNECT` is copied correctly
- Verify Postgres database is **not paused**
- Run migrations again: `npm run migrate`

### "Build failed"
- Check Next.js build succeeded locally: `npm run build`
- Review Vercel build logs (red errors)
- Most common: missing env variable

### "Login not working"
- Database not migrated yet (migrations step)
- Check JWT_SECRET is set
- Check Postgres connection string

### "Images not uploading"
- Check Cloudinary credentials
- Verify `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is public key
- `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET` are secret (not public)

### "Cannot reach admin panel"
- Make sure you're logged in first
- Check localStorage for `authToken`
- Middleware redirects if no token

## Monitoring & Updates

### View Logs
```
Vercel Dashboard → Your Project → Deployments → [Latest] → Logs
```

### Redeploy
```
Vercel Dashboard → Deployments → [Choose one] → Redeploy
```

Or push to GitHub and it auto-redeploys.

### Update Environment Variables
```
Vercel Dashboard → Settings → Environment Variables → Edit
```

Changes take effect on next deployment (push code or redeploy).

## Custom Domain (Optional)

1. Vercel Dashboard → Settings → Domains
2. Add your custom domain: `fashion-store.com`
3. Update DNS records (instructions in Vercel)
4. Update `NEXT_PUBLIC_APP_URL` to new domain

## Production Best Practices

### Before Going Live

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Test all auth flows (register, login, logout)
- [ ] Test product CRUD operations
- [ ] Test image upload to Cloudinary
- [ ] Test payment flow (Stripe test mode)
- [ ] Set up error monitoring (Sentry, LogRocket)
- [ ] Enable HTTPS (automatic on Vercel)

### After Going Live

- [ ] Monitor error logs regularly
- [ ] Set up email alerts for failures
- [ ] Track performance (Vercel Analytics)
- [ ] Regular database backups
- [ ] Keep dependencies updated

## Phase 10 Deployment Checklist

### Pre-Deployment (Local)
- [ ] All code committed to Git
- [ ] Run `npm run build` locally (verify no errors)
- [ ] Run `npm run dev` and test locally
- [ ] Check `.env.local` has all required variables

### Deployment Steps
- [ ] Push code to GitHub (main branch)
- [ ] Create/connect Vercel project
- [ ] Add all environment variables in Vercel
- [ ] Deploy (wait for green status)
- [ ] Run database migrations
- [ ] Configure Stripe webhook endpoint

### Post-Deployment Testing
- [ ] Admin login works
- [ ] Product creation works
- [ ] Image upload to Cloudinary works
- [ ] Customer can browse `/shop`
- [ ] Customer can add to cart
- [ ] Payment flow works (test card)
- [ ] Order appears in database
- [ ] Webhook was called in Stripe

### Production Readiness (Before Going Live with Real Money)
- [ ] All test cases pass
- [ ] Error handling works (try invalid payment)
- [ ] Cart persists across page reloads
- [ ] Images load from Cloudinary
- [ ] Admin dashboard shows stats
- [ ] JWT token authentication works
- [ ] Middleware protects admin routes

### Production Keys (Later, When Ready for Real Payments)
- [ ] Get live Stripe keys (`sk_live_*`, `pk_live_*`)
- [ ] Update `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY`
- [ ] Re-test payment flow with live keys
- [ ] Monitor logs and error rates
- [ ] Keep backups of environment variables

## Resources

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Postgres Guide](https://vercel.com/docs/storage/vercel-postgres)
- [Environment Variables](https://vercel.com/docs/projects/environment-variables)

## Support

If you get stuck:

1. Check Vercel build logs (Dashboard → Deployments → Logs)
2. Check GitHub Actions (if using)
3. Review `.env.local` locally (should match Vercel env vars)
4. Test locally first: `npm run dev` should work before deploying

---

**You're ready to deploy! 🚀**

Follow steps 1-8 above and your fashion store will be live.
