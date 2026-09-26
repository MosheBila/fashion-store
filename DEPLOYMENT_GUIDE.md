# Vercel Deployment Guide

Complete step-by-step guide to deploy the fashion e-store to Vercel.

## Prerequisites

- GitHub account
- Vercel account (free)
- Cloudinary account with credentials
- Stripe account with API keys
- Code pushed to GitHub

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

### Stripe
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_...
STRIPE_SECRET_KEY = sk_test_...
```

Get from:
1. Go to [stripe.com](https://stripe.com) → **Developers**
2. Go to **API Keys**
3. Copy test keys

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

## Step 8: Test Full Flow

After migrations are complete:

1. **Register/Login**
   ```
   Email: admin@example.com
   Password: password123
   ```

2. **Navigate to Admin**
   ```
   /admin → see dashboard
   /admin/products → see empty products table
   /admin/upload-test → test image upload
   ```

3. **Test Product Creation**
   - Add a category first (Phase 6, or manually via DB)
   - Create a product with image
   - See it in products table

## Environment Variables Checklist

```
✅ POSTGRES_URLCONNECT (database)
✅ NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
✅ CLOUDINARY_API_KEY
✅ CLOUDINARY_API_SECRET
✅ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
✅ STRIPE_SECRET_KEY
✅ JWT_SECRET
✅ NEXT_PUBLIC_APP_URL
```

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

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Run database migrations
3. Test full flow (auth → products → admin panel)
4. Phase 6 — Categories API
5. Phase 7 — Admin panel UI improvements
6. Phase 8 — Customer storefront (show products)
7. Phase 9 — Stripe checkout
8. Phase 10 — Production hardening

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
