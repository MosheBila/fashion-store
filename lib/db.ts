import { sql } from '@vercel/postgres';

/**
 * Database query helpers for the fashion e-store.
 * All queries use parameterized statements to prevent SQL injection.
 */

// Types
export interface Category {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  category_id: number;
  description: string | null;
  price: number;
  stock: number;
  sizes: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  email: string;
  password_hash: string;
  role: 'admin' | 'customer';
  created_at: string;
}

export interface Order {
  id: number;
  user_id: number;
  stripe_session_id: string | null;
  status: 'pending' | 'completed' | 'cancelled';
  total_price: number;
  items: Array<{
    product_id: number;
    quantity: number;
    price: number;
  }>;
  created_at: string;
  updated_at: string;
}

// Generic query function
export async function query(text: string, params?: unknown[]) {
  try {
    if (params) {
      return await sql.query(text, params);
    }
    return await sql.query(text);
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// PRODUCTS
export async function getProduct(id: number): Promise<Product | undefined> {
  const result = await query(
    'SELECT * FROM products WHERE id = $1',
    [id]
  );
  return result.rows[0];
}

export async function getAllProducts(): Promise<Product[]> {
  const result = await query(
    'SELECT * FROM products ORDER BY created_at DESC'
  );
  return result.rows;
}

export async function getProductsByCategory(categoryId: number): Promise<Product[]> {
  const result = await query(
    'SELECT * FROM products WHERE category_id = $1 ORDER BY name ASC',
    [categoryId]
  );
  return result.rows;
}

export async function createProduct(
  name: string,
  categoryId: number,
  price: number,
  stock: number,
  description?: string,
  sizes?: string,
  imageUrl?: string
): Promise<Product> {
  const result = await query(
    `INSERT INTO products (name, category_id, price, stock, description, sizes, image_url)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [name, categoryId, price, stock, description || null, sizes || null, imageUrl || null]
  );
  return result.rows[0];
}

export async function updateProduct(
  id: number,
  updates: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>
): Promise<Product> {
  const setClauses: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  Object.entries(updates).forEach(([key, value]) => {
    setClauses.push(`${key} = $${paramIndex}`);
    values.push(value);
    paramIndex++;
  });

  setClauses.push(`updated_at = NOW()`);
  values.push(id);

  const result = await query(
    `UPDATE products SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  );
  return result.rows[0];
}

export async function deleteProduct(id: number): Promise<boolean> {
  const result = await query('DELETE FROM products WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
}

// CATEGORIES
export async function getCategories(): Promise<Category[]> {
  const result = await query(
    'SELECT * FROM categories ORDER BY name ASC'
  );
  return result.rows;
}

export async function getCategory(id: number): Promise<Category | undefined> {
  const result = await query(
    'SELECT * FROM categories WHERE id = $1',
    [id]
  );
  return result.rows[0];
}

export async function createCategory(
  name: string,
  description?: string
): Promise<Category> {
  const result = await query(
    'INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *',
    [name, description || null]
  );
  return result.rows[0];
}

export async function deleteCategory(id: number): Promise<boolean> {
  const result = await query('DELETE FROM categories WHERE id = $1', [id]);
  return (result.rowCount ?? 0) > 0;
}

// USERS
export async function getUser(email: string): Promise<User | undefined> {
  const result = await query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0];
}

export async function getUserById(id: number): Promise<User | undefined> {
  const result = await query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0];
}

export async function createUser(
  email: string,
  passwordHash: string,
  role: 'admin' | 'customer' = 'customer'
): Promise<User> {
  const result = await query(
    'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING *',
    [email, passwordHash, role]
  );
  return result.rows[0];
}

// ORDERS
export async function getOrder(id: number): Promise<Order | undefined> {
  const result = await query(
    'SELECT * FROM orders WHERE id = $1',
    [id]
  );
  return result.rows[0];
}

export async function getOrdersByUser(userId: number): Promise<Order[]> {
  const result = await query(
    'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
    [userId]
  );
  return result.rows;
}

export async function createOrder(
  userId: number,
  totalPrice: number,
  items: Order['items'],
  stripeSessionId?: string
): Promise<Order> {
  const result = await query(
    `INSERT INTO orders (user_id, stripe_session_id, total_price, items)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [userId, stripeSessionId || null, totalPrice, JSON.stringify(items)]
  );
  return result.rows[0];
}

export async function updateOrderStatus(
  id: number,
  status: 'pending' | 'completed' | 'cancelled'
): Promise<Order> {
  const result = await query(
    'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
    [status, id]
  );
  return result.rows[0];
}

export async function getOrderByStripeSession(sessionId: string): Promise<Order | undefined> {
  const result = await query(
    'SELECT * FROM orders WHERE stripe_session_id = $1',
    [sessionId]
  );
  return result.rows[0];
}
