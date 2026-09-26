# Database Setup Guide

This project uses **Vercel Postgres** for the database and stores images on **Cloudinary**.

## Prerequisites

1. Vercel account (free tier)
2. Cloudinary account (free tier: 25GB storage)
3. Node.js 18+

## Step 1: Create Vercel Postgres Database

### Option A: Using Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Go to **Storage** → **Create Database** → **Postgres**
3. Select a region (closest to your users)
4. Click **Create**
5. Copy the connection string and save it safely

### Option B: Connect to Existing Database

If you already have a Vercel Postgres database, get the connection string from Vercel dashboard:
- Go to **Storage** → Select your database
- Copy the connection string under **Postgres** → **Connection String**

## Step 2: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your credentials:
   ```
   POSTGRES_URLCONNECT=postgresql://user:password@host:5432/database
   
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   
   JWT_SECRET=your-super-secret-key-change-this
   ```

### Getting Cloudinary Credentials

1. Sign up at [cloudinary.com](https://cloudinary.com) (free tier)
2. Go to **Dashboard** → **Account Details** → **API Keys**
3. Copy:
   - Cloud Name
   - API Key
   - API Secret

### Getting Stripe Credentials

1. Sign up at [stripe.com](https://stripe.com) (free tier)
2. Go to **Developers** → **API Keys**
3. Copy:
   - Publishable Key (pk_test_...)
   - Secret Key (sk_test_...)

## Step 3: Run Database Migrations

Once your `.env.local` is set up with the Postgres connection string:

```bash
npm run migrate
```

This will:
- Create `categories` table
- Create `products` table
- Create `users` table
- Create `orders` table
- Create indexes for performance

### Expected Output

```
Starting database migrations...
Found 1 migration(s).

Running migration: 001_create_tables.sql
✓ Executed: CREATE TABLE IF NOT EXISTS categories...
✓ Executed: CREATE TABLE IF NOT EXISTS products...
✓ Executed: CREATE TABLE IF NOT EXISTS users...
✓ Executed: CREATE TABLE IF NOT EXISTS orders...
✓ Migration 001_create_tables.sql completed.

✓ All migrations completed successfully!
```

## Step 4: Verify Database

### Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) → **Storage** → Your database
2. Click **Browse** to see tables and data

### Using SQL Client

Install a PostgreSQL client and connect:
```bash
psql postgresql://user:password@host:5432/database
\dt  # List all tables
```

## Database Schema

### Categories
- `id` (Primary Key)
- `name` (Unique)
- `description`
- `created_at`

### Products
- `id` (Primary Key)
- `name`
- `category_id` (Foreign Key)
- `description`
- `price` (Decimal: $0.00–$99,999.99)
- `stock` (Integer, default: 0)
- `sizes` (String: "XS,S,M,L,XL")
- `image_url` (Cloudinary URL)
- `created_at`
- `updated_at`

### Users
- `id` (Primary Key)
- `email` (Unique)
- `password_hash` (bcryptjs)
- `role` ("admin" or "customer")
- `created_at`

### Orders
- `id` (Primary Key)
- `user_id` (Foreign Key)
- `stripe_session_id`
- `status` ("pending", "completed", "cancelled")
- `total_price` (Decimal)
- `items` (JSONB: `[{product_id, quantity, price}]`)
- `created_at`
- `updated_at`

## Indexes

The following indexes are created for performance:
- `products.category_id`
- `products.created_at`
- `orders.user_id`
- `orders.status`
- `orders.stripe_session_id`
- `users.email`

## Database Query Helpers

All database operations use the helpers in `lib/db.ts`:

### Products
```typescript
import { getProduct, getAllProducts, createProduct, updateProduct, deleteProduct } from '@/lib/db';

const product = await getProduct(1);
const all = await getAllProducts();
const created = await createProduct('Shirt', 1, 29.99, 10);
```

### Categories
```typescript
import { getCategories, createCategory, deleteCategory } from '@/lib/db';

const categories = await getCategories();
const cat = await createCategory('Clothing');
```

### Users
```typescript
import { getUser, createUser } from '@/lib/db';

const user = await getUser('user@example.com');
const newUser = await createUser('admin@example.com', hashedPassword, 'admin');
```

### Orders
```typescript
import { getOrder, createOrder, updateOrderStatus } from '@/lib/db';

const order = await createOrder(userId, 99.99, items);
await updateOrderStatus(orderId, 'completed');
```

## Troubleshooting

### Connection Error: "ECONNREFUSED"
- Check `.env.local` has the correct `POSTGRES_URLCONNECT`
- Verify your Vercel Postgres is active (not paused)

### Migration Error: "relation already exists"
- The tables were already created
- You can safely run migrations multiple times (they use `IF NOT EXISTS`)

### Connection Error: "password authentication failed"
- Check your database credentials in `.env.local`
- Copy the connection string again from Vercel dashboard

## Next Steps

1. ✅ Database schema created
2. Next: Phase 3 — Cloudinary integration
3. Then: Phase 4 — Authentication (JWT)
4. Then: Phase 5 — Products API
5. Then: Phase 6 — Categories API
6. Then: Phase 7 — Admin Panel UI
7. Then: Phase 8 — Customer Storefront
8. Then: Phase 9 — Stripe Integration
9. Then: Phase 10 — Deploy to Vercel
