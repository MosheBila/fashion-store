# Products API Documentation

Complete guide to the Products API endpoints and admin management.

## API Endpoints

All endpoints require authentication (JWT token in `Authorization` header).

### GET /api/products

Get all products with optional filtering.

**Request:**
```bash
GET /api/products
Authorization: Bearer <token>
```

**Query Parameters:**
- `categoryId` (optional) — Filter by category ID

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Premium Cotton T-Shirt",
    "category_id": 1,
    "description": "High-quality cotton shirt...",
    "price": 49.99,
    "stock": 100,
    "sizes": "XS,S,M,L,XL",
    "image_url": "https://res.cloudinary.com/.../abc123",
    "created_at": "2026-09-26T10:00:00Z",
    "updated_at": "2026-09-26T10:00:00Z"
  }
]
```

### POST /api/products

Create a new product (admin only).

**Request:**
```bash
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Premium Cotton T-Shirt",
  "categoryId": 1,
  "price": 49.99,
  "stock": 100,
  "description": "High-quality cotton shirt",
  "sizes": "XS,S,M,L,XL",
  "imageUrl": "https://res.cloudinary.com/.../abc123"
}
```

**Required Fields:**
- `name` (string, min 3 chars)
- `categoryId` (number)
- `price` (number, > 0)
- `stock` (number, >= 0)

**Optional Fields:**
- `description` (string)
- `sizes` (string, comma-separated)
- `imageUrl` (string, Cloudinary URL from `/api/upload`)

**Response (201):**
```json
{
  "id": 1,
  "name": "Premium Cotton T-Shirt",
  "category_id": 1,
  "description": "High-quality cotton shirt",
  "price": 49.99,
  "stock": 100,
  "sizes": "XS,S,M,L,XL",
  "image_url": "https://res.cloudinary.com/.../abc123",
  "created_at": "2026-09-26T10:00:00Z",
  "updated_at": "2026-09-26T10:00:00Z"
}
```

**Error (400):**
```json
{
  "error": "Missing required fields: name, categoryId, price, stock"
}
```

### GET /api/products/[id]

Get a single product by ID.

**Request:**
```bash
GET /api/products/1
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Premium Cotton T-Shirt",
  "category_id": 1,
  "description": "High-quality cotton shirt",
  "price": 49.99,
  "stock": 100,
  "sizes": "XS,S,M,L,XL",
  "image_url": "https://res.cloudinary.com/.../abc123",
  "created_at": "2026-09-26T10:00:00Z",
  "updated_at": "2026-09-26T10:00:00Z"
}
```

**Error (404):**
```json
{
  "error": "Product not found"
}
```

### PUT /api/products/[id]

Update a product (admin only).

**Request:**
```bash
PUT /api/products/1
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Premium Cotton T-Shirt (Updated)",
  "price": 59.99,
  "stock": 150
}
```

**Optional Fields:**
All fields from POST are optional for updates.

**Response (200):**
Returns updated product object.

**Error (403):**
```json
{
  "error": "Only admins can update products"
}
```

### DELETE /api/products/[id]

Delete a product and its image from Cloudinary (admin only).

**Request:**
```bash
DELETE /api/products/1
Authorization: Bearer <token>
```

**Process:**
1. Find product in database
2. Delete image from Cloudinary (if exists)
3. Delete product from database
4. Return success response

**Response (200):**
```json
{
  "success": true,
  "message": "Product deleted"
}
```

**Error (403):**
```json
{
  "error": "Only admins can delete products"
}
```

## Admin Management UI

### Products Page

Visit `/admin/products` to manage products.

**Features:**
- ✅ View all products in a table
- ✅ Filter by category (via query params)
- ✅ Add new product with form
- ✅ Upload product image to Cloudinary
- ✅ Delete products (with confirmation)
- ✅ View inventory stats:
  - Total products
  - Total inventory value
  - Total stock quantity

### ProductForm Component

Reusable component for creating/editing products.

**Usage:**
```tsx
import ProductForm from '@/components/ProductForm';

<ProductForm
  categories={categories}
  onSubmit={handleSubmit}
  initialData={product}  // For editing
  isLoading={false}
/>
```

**Features:**
- Image upload with preview
- Category dropdown
- Price/stock validation
- Size selector (comma-separated)
- Full error handling

## Examples

### Create a Product

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer eyJ..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Luxury Handbag",
    "categoryId": 2,
    "price": 299.99,
    "stock": 25,
    "description": "Premium leather handbag",
    "sizes": "One Size",
    "imageUrl": "https://res.cloudinary.com/..."
  }'
```

### List All Products

```bash
curl http://localhost:3000/api/products \
  -H "Authorization: Bearer eyJ..."
```

### Filter by Category

```bash
curl http://localhost:3000/api/products?categoryId=2 \
  -H "Authorization: Bearer eyJ..."
```

### Update a Product

```bash
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Authorization: Bearer eyJ..." \
  -H "Content-Type: application/json" \
  -d '{
    "stock": 200,
    "price": 249.99
  }'
```

### Delete a Product

```bash
curl -X DELETE http://localhost:3000/api/products/1 \
  -H "Authorization: Bearer eyJ..."
```

## Workflow

### Admin Adding a Product

```
1. Admin visits /admin/products
2. Clicks "Add Product"
3. Fills form: name, category, price, stock, description, sizes
4. Clicks "Upload Image"
   → ImageUpload component uploads to Cloudinary
   → Returns URL + public ID
5. Form auto-fills imageUrl field
6. Admin clicks "Create Product"
   → POST /api/products with all data
   → Server validates + creates in database
7. Product appears in table immediately
```

### Deleting a Product

```
1. Admin clicks "Delete" on a product
2. Confirmation dialog appears
3. On confirm:
   → DELETE /api/products/[id]
   → Server deletes image from Cloudinary
   → Server deletes product from database
4. Table updates (product removed)
```

## Validation Rules

### Product Name
- ✅ Minimum 3 characters
- ✅ Required
- ❌ Empty or null

### Price
- ✅ Greater than 0
- ✅ Decimal (e.g., 29.99)
- ❌ Zero or negative

### Stock
- ✅ Zero or greater
- ✅ Integer (no decimals)
- ❌ Negative numbers

### Category
- ✅ Must exist in categories table
- ✅ Foreign key constraint
- ❌ Invalid or deleted category

### Image URL
- ✅ Optional
- ✅ Must be Cloudinary URL (if provided)
- ✅ Can be updated without re-uploading

## Image Handling

### Upload Flow

```
1. Admin selects image file
2. ImageUpload validates:
   - File type (images only)
   - File size (< 5MB)
3. Sends to POST /api/upload
4. Server uploads to Cloudinary
5. Returns URL + publicId
6. Form stores URL in imageUrl field
```

### Delete Flow

```
1. Product deleted via DELETE /api/products/[id]
2. Server extracts publicId from image_url
3. Calls cloudinary.uploader.destroy(publicId)
4. Image removed from Cloudinary CDN
5. Product removed from database
```

## Performance Optimization

### Database Indexes

Products table has indexes on:
- `category_id` — Fast filtering by category
- `created_at` — Fast sorting by date

### Pagination (Future)

Ready to add pagination:
```typescript
const offset = (page - 1) * limit;
const products = await query(
  'SELECT * FROM products LIMIT $1 OFFSET $2',
  [limit, offset]
);
```

### Caching (Future)

Can add Redis caching for:
- Product list (invalidate on create/update/delete)
- Individual products (24h TTL)

## Security

### Authentication
- ✅ Requires valid JWT token
- ✅ Token verified on every request
- ✅ Admin role verified for write operations

### Validation
- ✅ Input validated on server
- ✅ Type checking (string, number)
- ✅ Range validation (price > 0, stock >= 0)
- ✅ SQL injection prevented (parameterized queries)

### Authorization
- ✅ Only admins can create/update/delete
- ✅ Customers can view products only

## Testing

### Create Test Product

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer $(jq -r '.token' token.json)" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "categoryId": 1,
    "price": 99.99,
    "stock": 10,
    "description": "Test description"
  }'
```

### List Products

```bash
curl http://localhost:3000/api/products \
  -H "Authorization: Bearer $(jq -r '.token' token.json)" | jq
```

## Troubleshooting

### Error: "Only admins can create products"
- Token is not from an admin account
- Create an admin account via `/auth/register`

### Error: "Product not found"
- Product ID doesn't exist
- Check database: `SELECT * FROM products WHERE id = X`

### Error: "Invalid field types"
- Price must be number, not string
- CategoryId must be number
- Stock must be integer

### Image not deleting from Cloudinary
- Cloudinary credentials may be invalid
- Public ID may have changed
- Check `/api/upload` endpoint configuration

## Next Steps

1. ✅ Phase 5 — Products API complete
2. Phase 6 — Categories API
3. Phase 7 — Admin panel UI (improvements)
4. Phase 8 — Customer storefront (display products)
5. Phase 9 — Stripe checkout
6. Phase 10 — Deploy to Vercel
