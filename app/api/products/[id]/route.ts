import { NextRequest, NextResponse } from 'next/server';
import { getProduct, updateProduct, deleteProduct } from '@/lib/db';
import { cloudinary } from '@/lib/cloudinary';

/**
 * GET /api/products/[id]
 * Get a single product by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const product = await getProduct(productId);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    const message = error instanceof Error ? error.message : 'Failed to get product';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * PUT /api/products/[id]
 * Update a product (requires authentication)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Check authentication
    const userRole = request.headers.get('x-user-role');
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can update products' },
        { status: 403 }
      );
    }

    const productId = parseInt(params.id);
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    // Check if product exists
    const existingProduct = await getProduct(productId);
    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
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

    // Validate if provided
    if (name !== undefined && typeof name === 'string' && name.length < 3) {
      return NextResponse.json(
        { error: 'Product name must be at least 3 characters' },
        { status: 400 }
      );
    }

    if (price !== undefined && typeof price === 'number' && price <= 0) {
      return NextResponse.json(
        { error: 'Price must be greater than 0' },
        { status: 400 }
      );
    }

    if (stock !== undefined && typeof stock === 'number' && stock < 0) {
      return NextResponse.json(
        { error: 'Stock cannot be negative' },
        { status: 400 }
      );
    }

    // Update product
    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (categoryId !== undefined) updates.category_id = categoryId;
    if (price !== undefined) updates.price = price;
    if (stock !== undefined) updates.stock = stock;
    if (description !== undefined) updates.description = description;
    if (sizes !== undefined) updates.sizes = sizes;
    if (imageUrl !== undefined) updates.image_url = imageUrl;

    const updatedProduct = await updateProduct(productId, updates);

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Update product error:', error);
    const message = error instanceof Error ? error.message : 'Failed to update product';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/products/[id]
 * Delete a product and its image from Cloudinary (requires authentication)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const userRole = request.headers.get('x-user-role');
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can delete products' },
        { status: 403 }
      );
    }

    const productId = parseInt(params.id);
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    // Get product to retrieve image URL
    const product = await getProduct(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Delete image from Cloudinary if it exists
    if (product.image_url) {
      try {
        // Extract public ID from Cloudinary URL
        // Format: https://res.cloudinary.com/.../fashion-store/products/abc123
        const publicIdMatch = product.image_url.match(/\/([^/]+\/[^/]+\/[^/?]+)$/);
        if (publicIdMatch) {
          const publicId = publicIdMatch[1];
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (cloudinaryError) {
        console.error('Error deleting image from Cloudinary:', cloudinaryError);
        // Continue with product deletion even if image deletion fails
      }
    }

    // Delete product from database
    const deleted = await deleteProduct(productId);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Failed to delete product' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('Delete product error:', error);
    const message = error instanceof Error ? error.message : 'Failed to delete product';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
