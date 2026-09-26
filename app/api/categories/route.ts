import { NextRequest, NextResponse } from 'next/server';
import { getCategories, createCategory } from '@/lib/db';

/**
 * GET /api/categories
 * Get all categories (public - no auth required)
 */
export async function GET(request: NextRequest) {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    const message = error instanceof Error ? error.message : 'Failed to get categories';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST /api/categories
 * Create a new category (admin only)
 *
 * Body: {
 *   name: string,
 *   description?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const userRole = request.headers.get('x-user-role');
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can create categories' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, description } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Validate types
    if (typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Category name must be a string' },
        { status: 400 }
      );
    }

    // Validate name length
    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Category name must be at least 2 characters' },
        { status: 400 }
      );
    }

    if (name.trim().length > 255) {
      return NextResponse.json(
        { error: 'Category name must not exceed 255 characters' },
        { status: 400 }
      );
    }

    // Create category
    const category = await createCategory(name.trim(), description?.trim() || undefined);

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Create category error:', error);

    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes('unique constraint')) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 409 }
      );
    }

    const message = error instanceof Error ? error.message : 'Failed to create category';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
