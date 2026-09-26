import { NextRequest, NextResponse } from 'next/server';
import { deleteCategory, getCategory } from '@/lib/db';
import { query } from '@/lib/db';

/**
 * DELETE /api/categories/[id]
 * Delete a category (admin only)
 *
 * Note: Will fail if category has products assigned to it
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check authentication
    const userRole = request.headers.get('x-user-role');
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can delete categories' },
        { status: 403 }
      );
    }

    const categoryId = parseInt(id);

    if (isNaN(categoryId)) {
      return NextResponse.json(
        { error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    // Check if category exists
    const category = await getCategory(categoryId);
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if category has products
    const productsResult = await query(
      'SELECT COUNT(*) as count FROM products WHERE category_id = $1',
      [categoryId]
    );

    const productCount = parseInt(productsResult.rows[0].count);
    if (productCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category with ${productCount} product(s). Delete or reassign products first.`,
        },
        { status: 409 }
      );
    }

    // Delete category
    const deleted = await deleteCategory(categoryId);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Failed to delete category' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Category deleted',
    });
  } catch (error) {
    console.error('Delete category error:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete category';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
