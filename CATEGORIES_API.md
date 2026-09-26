# Categories API Documentation

Complete guide to the Categories API endpoints and admin management.

## Overview

Categories organize products in the storefront. Each category:
- Has a unique name
- Can have an optional description
- Can have multiple products assigned
- Cannot be deleted if it has products

## API Endpoints

### GET /api/categories

Get all categories (public - no authentication required).

**Request:**
```bash
GET /api/categories
```

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Women's Clothing",
    "description": "Premium women's fashion collection",
    "created_at": "2026-09-26T10:00:00Z"
  },
  {
    "id": 2,
    "name": "Men's Accessories",
    "description": "High-end accessories for men",
    "created_at": "2026-09-26T10:05:00Z"
  }
]
```

### POST /api/categories

Create a new category (admin only).

**Request:**
```bash
POST /api/categories
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Handbags",
  "description": "Luxury handbags collection"
}
```

**Required Fields:**
- `name` (string, min 2 chars, max 255)

**Optional Fields:**
- `description` (string)

**Response (201):**
```json
{
  "id": 3,
  "name": "Handbags",
  "description": "Luxury handbags collection",
  "created_at": "2026-09-26T10:10:00Z"
}
```

**Error (409) - Already Exists:**
```json
{
  "error": "Category with this name already exists"
}
```

### DELETE /api/categories/[id]

Delete a category (admin only).

**Request:**
```bash
DELETE /api/categories/3
Authorization: Bearer <token>
```

**Process:**
1. Check if category exists
2. Check if category has products
3. If no products, delete category
4. Return success

**Response (200):**
```json
{
  "success": true,
  "message": "Category deleted"
}
```

**Error (409) - Has Products:**
```json
{
  "error": "Cannot delete category with 5 product(s). Delete or reassign products first."
}
```

**Error (404) - Not Found:**
```json
{
  "error": "Category not found"
}
```

## Admin Management UI

### Categories Page

Visit `/admin/categories` to manage categories.

**Features:**
- ✅ View all categories in a table
- ✅ Add new category with form
- ✅ Delete category (with validation)
- ✅ View total count
- ✅ See creation dates
- ✅ Error handling

### CategoryForm Component

Reusable component for creating categories.

**Usage:**
```tsx
import CategoryForm from '@/components/CategoryForm';

<CategoryForm
  onSubmit={handleSubmit}
  initialData={category}  // For editing
  isLoading={false}
/>
```

**Features:**
- Simple name + description form
- Validation (2-255 chars)
- Full error handling
- Loading state

## Examples

### Create a Category

```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Authorization: Bearer eyJ..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Evening Wear",
    "description": "Formal and evening apparel"
  }'
```

### List All Categories

```bash
curl http://localhost:3000/api/categories
```

### Delete a Category

```bash
curl -X DELETE http://localhost:3000/api/categories/2 \
  -H "Authorization: Bearer eyJ..."
```

## Workflow

### Admin Adding a Category

```
1. Admin visits /admin/categories
2. Clicks "Add Category"
3. Fills form: name, description
4. Clicks "Create Category"
   → POST /api/categories with data
   → Server validates + creates in database
5. Category appears in table immediately
```

### Using Categories with Products

```
1. Create categories first (required)
2. When creating products:
   → ProductForm loads categories via GET /api/categories
   → Admin selects a category from dropdown
   → Category ID stored with product
3. Dropdown auto-updates when categories change
```

## Validation Rules

### Category Name
- ✅ Minimum 2 characters
- ✅ Maximum 255 characters
- ✅ Must be unique (no duplicates)
- ✅ Required
- ❌ Empty, whitespace only, or null

### Description
- ✅ Optional
- ✅ Any length
- ✅ Can be empty string

## Delete Protection

Categories are protected from deletion if they have products:

**Before Delete:**
```sql
SELECT COUNT(*) FROM products WHERE category_id = ?
```

**If Count > 0:**
- Deletion is blocked
- Error returned: "Cannot delete category with X product(s)"
- User must delete or reassign products first

**This ensures referential integrity** — no orphaned products.

## Database Integration

### Schema

```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_categories_name ON categories(name);
```

### Database Functions

From `lib/db.ts`:

```typescript
export async function getCategories(): Promise<Category[]>
export async function getCategory(id: number): Promise<Category | undefined>
export async function createCategory(name: string, description?: string): Promise<Category>
export async function deleteCategory(id: number): Promise<boolean>
```

## Performance

- **No images** — Fast, lightweight queries
- **No inventory** — Simple CRUD operations
- **Index on name** — Fast lookups
- **Caching opportunity** — Categories change rarely

## Security

### Authentication
- ✅ GET /api/categories is public (no token required)
- ✅ POST requires admin role
- ✅ DELETE requires admin role

### Validation
- ✅ Input validated on server
- ✅ Type checking (string)
- ✅ Length validation
- ✅ Unique constraint on database

### Authorization
- ✅ Only admins can create/delete
- ✅ Customers can view categories only

## Testing

### Create Test Category

```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Authorization: Bearer $(jq -r '.token' token.json)" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Category",
    "description": "For testing"
  }'
```

### List Categories

```bash
curl http://localhost:3000/api/categories | jq
```

### Try to Delete

```bash
curl -X DELETE http://localhost:3000/api/categories/1 \
  -H "Authorization: Bearer $(jq -r '.token' token.json)"
```

## Troubleshooting

### Error: "Only admins can create categories"
- Token is not from an admin account
- Create an admin account via `/auth/register`

### Error: "Category with this name already exists"
- Category name is not unique
- Use a different name

### Error: "Cannot delete category with X product(s)"
- Category has products assigned
- Delete products first, or reassign to different category
- This is intentional protection

### Error: "Category not found"
- Category ID doesn't exist
- Check database: `SELECT * FROM categories WHERE id = X`

## Admin Workflow Integration

### In ProductForm

```typescript
// Categories loaded automatically
const [categories, setCategories] = useState<Category[]>([]);

useEffect(() => {
  fetch('/api/categories')
    .then(r => r.json())
    .then(setCategories);
}, []);

// Dropdown in form
<select name="categoryId">
  {categories.map(cat => (
    <option key={cat.id} value={cat.id}>
      {cat.name}
    </option>
  ))}
</select>
```

### When Products Sidebar Updates

```
Admin adds new category
  ↓
Goes to products page
  ↓
ProductForm refetches categories
  ↓
Dropdown shows new category
  ↓
Can use immediately
```

## API Usage in Frontend

### Fetch Categories (Auto-called)

```typescript
const categories = await fetch('/api/categories').then(r => r.json());
```

### Create Category (Admin)

```typescript
const token = localStorage.getItem('authToken');
const result = await fetch('/api/categories', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ name: 'New Category' })
}).then(r => r.json());
```

### Delete Category (Admin)

```typescript
const token = localStorage.getItem('authToken');
await fetch(`/api/categories/${id}`, {
  method: 'DELETE',
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## Next Steps

1. ✅ Phase 6 — Categories API complete
2. Phase 8 — Customer storefront (show products + categories)
3. Phase 9 — Stripe checkout
4. Phase 10 — Deploy to Vercel

---

## Resources

- [Database Setup](./DATABASE_SETUP.md) — Schema reference
- [Products API](./PRODUCTS_API.md) — How products use categories
- [Auth Setup](./AUTH_SETUP.md) — Authentication reference
