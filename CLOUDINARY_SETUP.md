# Cloudinary Integration Setup

This guide explains how to set up Cloudinary for image storage and optimization.

## Prerequisites

- Cloudinary account (free tier: 25GB = 50K+ images)
- `.env.local` file configured with Cloudinary credentials

## Step 1: Get Cloudinary Credentials

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Go to **Dashboard** → **Account Details** → **API Keys**
4. Copy:
   - **Cloud Name** — used for all image URLs
   - **API Key** — used for server-side operations
   - **API Secret** — used for server-side operations ⚠️ Keep secret!

## Step 2: Update `.env.local`

Add to `.env.local`:
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Note:** `NEXT_PUBLIC_*` variables are exposed to the browser (safe). `API_SECRET` stays on server only.

## Components

### ImageUpload.tsx

Client component for uploading images to Cloudinary.

**Usage:**
```tsx
import ImageUpload from '@/components/ImageUpload';

<ImageUpload
  onUpload={(url, publicId) => {
    console.log('Image uploaded:', url, publicId);
    // Save to database
  }}
  onError={(error) => {
    console.error('Upload failed:', error);
  }}
/>
```

**Features:**
- Drag & drop support (HTML5)
- Image preview before upload
- File validation (type, size)
- Loading state
- Error handling

### ProductImage.tsx

Optimized image component with automatic transformations.

**Usage:**
```tsx
import ProductImage from '@/components/ProductImage';

<ProductImage
  url="https://res.cloudinary.com/.../fashion-store/products/abc123"
  alt="Product name"
  size="detail"  // 'thumbnail' | 'detail' | 'hero'
  priority={false}  // Eager loading for above-fold images
/>
```

**Sizes:**
- **thumbnail** — 200×200px (grid listings)
- **detail** — 600×600px (product detail page)
- **hero** — 1200×800px (hero banners)

**Transformations applied:**
```
w_600,h_600,c_fit,q_auto,f_auto
```

- `w_600,h_600` — Resize to 600×600
- `c_fit` — Contain image without cropping
- `q_auto` — Automatic quality optimization
- `f_auto` — Best format (WebP for modern browsers, JPG for legacy)

### /api/upload

Server endpoint for uploading images to Cloudinary.

**Request:**
```bash
POST /api/upload
Content-Type: multipart/form-data

file: <image file>
```

**Response:**
```json
{
  "url": "https://res.cloudinary.com/.../fashion-store/products/xyz789",
  "publicId": "fashion-store/products/xyz789"
}
```

**Error Handling:**
```json
{
  "error": "File must be smaller than 5MB"
}
```

## Test the Integration

Visit `/admin/upload-test` to test:
1. Upload an image
2. See it displayed in 3 different sizes
3. View the Cloudinary URL and public ID

## Database Integration

Store Cloudinary URLs in the database:

```typescript
import { createProduct } from '@/lib/db';

const product = await createProduct(
  'Luxury Shirt',
  categoryId,
  99.99,
  50,
  'Premium fabric',
  'XS,S,M,L,XL',
  'https://res.cloudinary.com/.../fashion-store/products/xyz789'  // Cloudinary URL
);
```

## Delete Images

When deleting products, also delete from Cloudinary:

```typescript
import { deleteProduct } from '@/lib/db';
import { cloudinary } from '@/lib/cloudinary';

// Delete from Cloudinary first
await cloudinary.uploader.destroy('fashion-store/products/xyz789');

// Then delete from database
await deleteProduct(productId);
```

## Image Optimization Tips

### Folder Organization
All product images are stored in `fashion-store/products/` folder on Cloudinary for easy management.

### Naming Convention
Cloudinary auto-generates public IDs. You get:
```
fashion-store/products/abc123def456
```

### Bandwidth Optimization
- Cloudinary free tier: **25GB/month bandwidth**
- Our transformations (quality auto, format auto) reduce file sizes by 60–70%
- Example: 2MB original → 400–800KB optimized

### Responsive Images
ProductImage component uses aspect-ratio padding technique:
```
padding-bottom: (height / width) * 100%
```

This maintains proportions while image loads, preventing layout shift.

## Troubleshooting

### Error: "Cloudinary credentials not configured"
- Check `.env.local` has `CLOUDINARY_*` variables
- Restart dev server after changing `.env.local`
- Verify values are copied correctly (no spaces, typos)

### Error: "Upload failed"
- Check file is an image (JPG, PNG, WebP, GIF)
- Check file size < 5MB
- Check network connection
- Check browser console for details

### Image not displaying
- Verify Cloudinary URL in database
- Check URL format: `https://res.cloudinary.com/.../...`
- Visit URL directly in browser to test
- Check Cloudinary dashboard for upload history

### Images loading slowly
- Cloudinary CDN should be fast automatically
- Check image size (use `/admin/upload-test` to verify transformations)
- Enable aggressive caching on Vercel (next.config.js)

## Next Steps

1. ✅ Phase 3 — Cloudinary integration complete
2. Phase 4 — JWT authentication (login/register)
3. Phase 5 — Products API with image upload
4. Phase 6 — Categories API
5. Phase 7 — Admin panel UI
6. Phase 8 — Customer storefront with products
7. Phase 9 — Stripe checkout
8. Phase 10 — Deploy to Vercel

## Security Notes

- ⚠️ Never commit `.env.local` to Git (add to `.gitignore`)
- ⚠️ `CLOUDINARY_API_SECRET` stays on server only
- ✅ Image URLs are public (customers need to see them)
- ✅ Delete operations require API key (server-side only)
- ✅ Upload endpoint validates file type and size on server

## Resources

- [Cloudinary Docs](https://cloudinary.com/documentation)
- [Cloudinary Transformations](https://cloudinary.com/documentation/transformation_reference)
- [Cloudinary React SDK](https://cloudinary.com/documentation/react_integration)
