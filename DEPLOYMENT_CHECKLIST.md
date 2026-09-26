# Deployment Checklist — Phase 10

Quick reference for deploying the complete fashion e-store to Vercel.

**All 9 phases complete — Ready for production deployment.**

## Pre-Deployment

- [ ] Code committed to GitHub
- [ ] All changes pushed: `git push origin main`
- [ ] Local `.env.local` not committed (in `.gitignore`)
- [ ] Build locally works: `npm run build`
- [ ] No TypeScript errors: `npx tsc --noEmit`

## Vercel Setup

- [ ] Vercel account created (vercel.com)
- [ ] GitHub connected to Vercel
- [ ] Project imported from GitHub
- [ ] Framework detected as "Next.js" ✓

## Environment Variables in Vercel (9 total)

### Database & Services
- [ ] `POSTGRES_URLCONNECT` → Vercel Postgres connection string
- [ ] `JWT_SECRET` → Random 32-char secret
- [ ] `NEXT_PUBLIC_APP_URL` → https://your-domain.vercel.app

### Cloudinary (Image Upload & CDN)
- [ ] `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` → Cloudinary cloud name
- [ ] `CLOUDINARY_API_KEY` → Cloudinary API key
- [ ] `CLOUDINARY_API_SECRET` → Cloudinary API secret

### Stripe (Payment Processing)
- [ ] `STRIPE_SECRET_KEY` → Stripe sk_test_* (test mode)
- [ ] `STRIPE_PUBLISHABLE_KEY` → Stripe pk_test_* (test mode)
- [ ] `STRIPE_WEBHOOK_SECRET` → whsec_* (set after webhook configured)

## Database Setup

- [ ] Vercel Postgres created in Storage tab
- [ ] Connection string copied to `POSTGRES_URLCONNECT`
- [ ] Migrations run: `npm run migrate`
- [ ] Tables verified: `SELECT * FROM categories;`

## Initial Deployment

- [ ] Click "Deploy" in Vercel
- [ ] Wait for build to complete (5-10 min)
- [ ] Check build logs for errors
- [ ] Live URL working: `https://your-app.vercel.app`

## Stripe Webhook Setup (CRITICAL FOR PAYMENTS ⭐)

- [ ] Stripe webhook endpoint configured:
  - Go to Stripe Dashboard → Developers → Webhooks → Add endpoint
  - URL: `https://your-app.vercel.app/api/webhooks/stripe`
  - Event: `checkout.session.completed`
- [ ] Webhook signing secret copied
- [ ] Added to Vercel env: `STRIPE_WEBHOOK_SECRET=whsec_...`
- [ ] Vercel redeployed (for env var to take effect)

## Post-Deployment Testing

### Admin & Products
- [ ] Landing page loads (`/`)
- [ ] Login page accessible (`/auth/login`)
- [ ] Admin redirect works (`/admin` → `/auth/login`)
- [ ] Register/login works (after DB migration)
- [ ] Admin dashboard accessible after login (`/admin`)
- [ ] Products table visible (`/admin/products`)
- [ ] Image upload test works (`/admin/upload-test`)
- [ ] Can create product with category
- [ ] Can upload product image

### Customer Storefront
- [ ] Shop page loads (`/shop`)
- [ ] Products display in grid
- [ ] Can search products by name
- [ ] Category filter buttons work
- [ ] Can click product for details
- [ ] Product detail page shows size options
- [ ] Can add product to cart
- [ ] Cart persists on page reload
- [ ] Can adjust quantities in cart
- [ ] Can remove items from cart

### Payment Flow ⭐ CRITICAL
- [ ] Cart page shows order summary
- [ ] Tax calculated correctly (10%)
- [ ] Shipping free on orders > $100
- [ ] "Proceed to Checkout" button works
- [ ] Redirects to Stripe payment page
- [ ] Test card payment succeeds: `4242 4242 4242 4242`
- [ ] Redirected to success page with order number
- [ ] Order appears in database (status: 'completed')
- [ ] Webhook was called in Stripe dashboard
- [ ] Cart clears after successful payment

## Security Verification

- [ ] HTTPS enabled (automatic)
- [ ] Environment variables not exposed in logs
- [ ] JWT tokens working (localStorage)
- [ ] Admin routes protected (middleware)
- [ ] Cloudinary credentials secure (API secret)

## Go Live Checklist

- [ ] All tests passing
- [ ] Error handling working
- [ ] Logging configured
- [ ] Monitoring set up (optional: Sentry)
- [ ] Database backups enabled
- [ ] Custom domain configured (if needed)
- [ ] Analytics enabled (Vercel built-in)

---

## Quick Deploy Command

```bash
# From project root
cd C:\Users\User\OneDrive\מסמכים\fashion-store

# 1. Commit changes
git add -A
git commit -m "deployment: ready for production"

# 2. Push to GitHub
git push origin main

# 3. Go to vercel.com
# - Project auto-redeploys from GitHub

# 4. Add env variables in Vercel Dashboard
# Settings → Environment Variables

# 5. Run migrations
npm run migrate

# 6. Test live site
https://your-project.vercel.app
```

---

## Rollback

If something goes wrong:

1. Vercel Dashboard → Deployments
2. Click previous working deployment
3. Click "Redeploy" button
4. Automatic rollback in 30 seconds

---

## Support Resources

- Vercel Status: [status.vercel.com](https://status.vercel.com)
- Build Logs: Vercel Dashboard → Deployments → [Select] → Logs
- Database Logs: Vercel Dashboard → Storage → Postgres → Logs
- Next.js Docs: [nextjs.org/docs](https://nextjs.org/docs)

---

**Deploy confidently! You've got this. 🚀**
