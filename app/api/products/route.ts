import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts, createProduct } from '@/lib/db';

/**
 * GET /api/products
 * Get all products with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categoryId = searchParams.get('categoryId');

    // Get all products (filtering by category handled in database query)
    const products = await getAllProducts();

    // Filter by category if provided
    const filtered = categoryId
      ? products.filter((p) => p.category_id === parseInt(categoryId))
      : products;

    return NextResponse.json(filtered);
  } catch (error) {
    console.error('Get products error:', error);
    const message = error instanceof Error ? error.message : 'Failed to get products';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST /api/products
 * Create a new product (requires authentication)
 *
 * Body: {
 *   name: string,
 *   categoryId: number,
 *   price: number,
 *   stock: number,
 *   description?: string,
 *   sizes?: string (comma-separated: "XS,S,M,L,XL"),
 *   imageUrl?: string (Cloudinary URL from /api/upload)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication (middleware sets x-user-role header)
    const userRole = request.headers.get('x-user-role');
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can create products' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      name,
      categoryId,
      price,
      stock,
      description,
      sizes,
      imageUrl,
    } = body;

    // Validate required fields
    if (!name || categoryId === undefined || price === undefined || stock === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: name, categoryId, price, stock' },
        { status: 400 }
      );
    }

    // Validate types
    if (typeof name !== 'string' || typeof price !== 'number' || typeof stock !== 'number') {
      return NextResponse.json(
        { error: 'Invalid field types' },
        { status: 400 }
      );
    }

    // Validate values
    if (name.length < 3) {
      return NextResponse.json(
        { error: 'Product name must be at least 3 characters' },
        { status: 400 }
      );
    }

    if (price <= 0) {
      return NextResponse.json(
        { error: 'Price must be greater than 0' },
        { status: 400 }
      );
    }

    if (stock < 0) {
      return NextResponse.json(
        { error: 'Stock cannot be negative' },
        { status: 400 }
      );
    }

    // Create product
    const product = await createProduct(
      name,
      categoryId,
      price,
      stock,
      description || undefined,
      sizes || undefined,
      imageUrl || undefined
    );

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create product';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
