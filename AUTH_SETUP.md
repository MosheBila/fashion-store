# JWT Authentication Setup

This guide explains the JWT authentication system for the admin panel.

## Overview

The system uses **JWT (JSON Web Tokens)** for stateless authentication:

1. User registers/logs in with email & password
2. Server generates JWT token
3. Client stores token in localStorage
4. Client sends token with admin requests
5. Middleware verifies token on protected routes
6. Token expires after 7 days

## API Endpoints

### POST /api/auth/register

Register a new admin account.

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "password123",
  "role": "admin"  // optional, defaults to 'customer'
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

**Error (409):**
```json
{
  "error": "User already exists"
}
```

### POST /api/auth/login

Login with email and password.

**Request:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

**Error (401):**
```json
{
  "error": "Invalid email or password"
}
```

### POST /api/auth/verify

Verify JWT token validity.

**Request:**
```
POST /api/auth/verify
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "valid": true,
  "user": {
    "id": 1,
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

**Error (401):**
```json
{
  "valid": false,
  "error": "Invalid or expired token"
}
```

## Protected Routes

The following routes require valid JWT tokens:

- `/admin/*` — Admin panel (requires admin role)
- `/api/products/*` — Product API (requires admin role)
- `/api/categories/*` — Category API (requires admin role)
- `/api/upload` — Image upload (requires admin role)

## How It Works

### 1. Registration/Login Flow

```
User enters email/password
        ↓
POST /api/auth/register or /api/auth/login
        ↓
Server validates credentials
        ↓
Server creates JWT token (7-day expiry)
        ↓
Client stores in localStorage
        ↓
Client redirects to /admin
```

### 2. Protected Route Flow

```
User visits /admin/products
        ↓
Middleware checks Authorization header
        ↓
Middleware verifies JWT token
        ↓
Middleware checks user.role == 'admin'
        ↓
Request proceeds with user info in headers
```

### 3. Token Storage

Tokens are stored in **localStorage** (browser):

```javascript
// After login
localStorage.setItem('authToken', token);
localStorage.setItem('user', JSON.stringify(user));

// Before API call
const token = localStorage.getItem('authToken');
fetch('/api/products', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// On logout
localStorage.removeItem('authToken');
localStorage.removeItem('user');
```

## Components

### LoginForm.tsx

Reusable login/register component.

**Usage:**
```tsx
import LoginForm from '@/components/LoginForm';

<LoginForm mode="login" onSuccess={(token) => {
  console.log('Login successful');
}} />
```

**Features:**
- Toggle between login and register modes
- Email validation
- Password strength check
- Error handling
- Auto-redirect to /admin on success

### Middleware

Middleware file: `middleware.ts`

**Protected Routes:**
- `/admin/*` — Redirects to login if no token
- `/api/products/*` — Returns 401 if no token
- `/api/categories/*` — Returns 401 if no token
- `/api/upload` — Returns 401 if no token

**Features:**
- Token extraction from `Authorization: Bearer <token>`
- Token verification
- Admin role check
- User info injection into request headers

## Security

### JWT Secret

The `JWT_SECRET` in `.env.local` should be:
- ✅ Long (32+ characters)
- ✅ Random
- ✅ Complex
- ❌ Never committed to Git

**Generate a secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Token Expiry

Tokens expire after 7 days:

```typescript
jwt.sign(payload, secret, { expiresIn: '7d' })
```

After expiry, users must log in again.

### Password Hashing

Passwords are hashed with **bcryptjs** (salt rounds: 10):

```typescript
const hash = await bcrypt.hash(password, 10);
const match = await bcrypt.compare(password, hash);
```

Never stored in plain text.

### HTTPS in Production

⚠️ In production, always use **HTTPS** to:
- Protect tokens in transit
- Prevent man-in-the-middle attacks
- Secure localStorage access

## Testing

### 1. Test Registration

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "password123",
    "role": "admin"
  }'
```

### 2. Test Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "password123"
  }'
```

### 3. Copy the token and test a protected route

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

curl -X POST http://localhost:3000/api/auth/verify \
  -H "Authorization: Bearer $TOKEN"
```

### 4. Test in browser

1. Visit `http://localhost:3000/auth/login`
2. Click "Register"
3. Create account (e.g., `test@example.com` / `password123`)
4. You'll be redirected to `/admin`
5. Token is stored in `localStorage`

## Troubleshooting

### Error: "No token provided"

- Make sure you're sending the `Authorization` header
- Format: `Authorization: Bearer <token>`
- Not: `Authorization: <token>`

### Error: "Invalid or expired token"

- Token may have expired (7 days)
- User needs to log in again
- Or JWT_SECRET changed

### Error: "User already exists"

- Email is already registered
- Use login instead
- Or use a different email

### Middleware not working

- Check `.env.local` has `JWT_SECRET`
- Restart dev server after env changes
- Verify middleware.ts is in root directory
- Check middleware config matcher paths

## Production Deployment

When deploying to Vercel:

1. Set `JWT_SECRET` in Vercel environment variables
2. Use HTTPS (automatic on Vercel)
3. Set `NEXT_PUBLIC_APP_URL` to your production domain
4. Configure CORS if frontend is on different domain

```
VERCEL_ENV: production
JWT_SECRET: <long-random-secret>
NEXT_PUBLIC_APP_URL: https://your-domain.com
```

## Next Steps

1. ✅ Phase 4 — JWT authentication complete
2. Phase 5 — Products API with authentication
3. Phase 6 — Categories API with authentication
4. Phase 7 — Admin panel UI (products, categories)
5. Phase 8 — Customer storefront
6. Phase 9 — Stripe checkout
7. Phase 10 — Deploy to Vercel

## Resources

- [JWT.io](https://jwt.io) — JWT documentation
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) — Password hashing
- [Next.js Middleware](https://nextjs.org/docs/advanced-features/middleware) — Middleware guide
- [RFC 7519](https://tools.ietf.org/html/rfc7519) — JWT specification
