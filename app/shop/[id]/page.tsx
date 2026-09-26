'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProductImage from '@/components/ProductImage';
import { addToCart } from '@/lib/cart';

interface Product {
  id: number;
  name: string;
  category_id: number;
  description: string;
  price: number;
  stock: number;
  sizes: string;
  image_url: string;
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  const productId = parseInt(params.id);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) throw new Error('Product not found');
      const data = await response.json();
      setProduct(data);
      if (data.sizes) {
        setSelectedSize(data.sizes.split(',')[0].trim());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product && quantity > 0) {
      addToCart(product, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-background)',
      }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-background)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{
            color: 'var(--color-error)',
            marginBottom: 'var(--spacing-md)',
          }}>
            {error || 'Product not found'}
          </p>
          <Link
            href="/shop"
            style={{
              color: 'var(--color-accent)',
              textDecoration: 'none',
              fontWeight: 'var(--font-weight-bold)',
            }}
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const sizes = product.sizes ? product.sizes.split(',').map((s) => s.trim()) : [];
  const inStock = product.stock > 0;

  return (
    <div style={{
      backgroundColor: 'var(--color-background)',
      minHeight: '100vh',
      paddingBottom: 'var(--spacing-2xl)',
    }}>
      {/* Breadcrumb */}
      <div style={{
        backgroundColor: 'var(--color-white)',
        borderBottom: '1px solid var(--color-border)',
        padding: 'var(--spacing-md) var(--spacing-lg)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Link
            href="/shop"
            style={{
              color: 'var(--color-accent)',
              textDecoration: 'none',
              fontWeight: 'var(--font-weight-bold)',
            }}
          >
            ← Back to Shop
          </Link>
        </div>
      </div>

      {/* Product Section */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: 'var(--spacing-2xl) var(--spacing-lg)',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--spacing-2xl)',
      }}>
        {/* Image */}
        <div style={{
          backgroundColor: 'var(--color-white)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--color-border)',
          padding: 'var(--spacing-lg)',
        }}>
          <ProductImage
            url={product.image_url}
            alt={product.name}
            size="detail"
            priority
          />
        </div>

        {/* Details */}
        <div>
          <h1 style={{
            fontSize: 'var(--font-size-3xl)',
            fontWeight: 'var(--font-weight-extra-bold)',
            color: 'var(--color-primary)',
            marginBottom: 'var(--spacing-md)',
            margin: '0 0 var(--spacing-md) 0',
          }}>
            {product.name}
          </h1>

          {/* Price */}
          <div style={{
            fontSize: 'var(--font-size-2xl)',
            fontWeight: 'var(--font-weight-extra-bold)',
            color: 'var(--color-accent)',
            marginBottom: 'var(--spacing-lg)',
          }}>
            ${product.price.toFixed(2)}
          </div>

          {/* Description */}
          {product.description && (
            <p style={{
              color: 'var(--color-text-secondary)',
              lineHeight: 'var(--line-height-relaxed)',
              marginBottom: 'var(--spacing-lg)',
            }}>
              {product.description}
            </p>
          )}

          {/* Stock Status */}
          <div style={{
            padding: 'var(--spacing-md)',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: inStock ? '#e8f5e9' : '#ffebee',
            color: inStock ? 'var(--color-success)' : 'var(--color-error)',
            fontWeight: 'var(--font-weight-bold)',
            marginBottom: 'var(--spacing-lg)',
            textAlign: 'center',
          }}>
            {inStock ? `In Stock (${product.stock} available)` : 'Out of Stock'}
          </div>

          {/* Sizes */}
          {sizes.length > 0 && (
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
              <label style={{
                display: 'block',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-primary)',
                marginBottom: 'var(--spacing-md)',
              }}>
                Size
              </label>
              <div style={{
                display: 'flex',
                gap: 'var(--spacing-sm)',
                flexWrap: 'wrap',
              }}>
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      padding: 'var(--spacing-sm) var(--spacing-md)',
                      backgroundColor: selectedSize === size ? 'var(--color-primary)' : 'var(--color-border)',
                      color: selectedSize === size ? 'var(--color-white)' : 'var(--color-text-primary)',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      fontWeight: 'var(--font-weight-bold)',
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <label style={{
              display: 'block',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-primary)',
              marginBottom: 'var(--spacing-md)',
            }}>
              Quantity
            </label>
            <div style={{
              display: 'flex',
              gap: 'var(--spacing-sm)',
              alignItems: 'center',
            }}>
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  padding: 'var(--spacing-sm)',
                  width: '40px',
                  backgroundColor: 'var(--color-border)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  fontSize: 'var(--font-size-lg)',
                }}
              >
                −
              </button>
              <input
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                style={{
                  width: '60px',
                  padding: 'var(--spacing-sm)',
                  textAlign: 'center',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-family)',
                }}
              />
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                style={{
                  padding: 'var(--spacing-sm)',
                  width: '40px',
                  backgroundColor: 'var(--color-border)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  fontSize: 'var(--font-size-lg)',
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!inStock}
            style={{
              width: '100%',
              padding: 'var(--spacing-md)',
              backgroundColor: inStock ? 'var(--color-primary)' : 'var(--color-gray-medium)',
              color: 'var(--color-white)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 'var(--font-weight-bold)',
              fontSize: 'var(--font-size-base)',
              cursor: inStock ? 'pointer' : 'not-allowed',
              opacity: inStock ? 1 : 0.6,
              transition: 'all var(--transition-fast)',
              marginBottom: 'var(--spacing-md)',
            }}
            onMouseEnter={(e) => {
              if (inStock) {
                e.currentTarget.style.backgroundColor = 'var(--color-accent)';
                e.currentTarget.style.color = 'var(--color-primary)';
              }
            }}
            onMouseLeave={(e) => {
              if (inStock) {
                e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                e.currentTarget.style.color = 'var(--color-white)';
              }
            }}
          >
            {inStock ? '🛒 Add to Cart' : 'Out of Stock'}
          </button>

          {/* Success Message */}
          {addedToCart && (
            <div style={{
              backgroundColor: '#e8f5e9',
              color: 'var(--color-success)',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--radius-sm)',
              textAlign: 'center',
              fontWeight: 'var(--font-weight-bold)',
            }}>
              ✓ Added to cart!
            </div>
          )}

          {/* View Cart Link */}
          <div style={{
            marginTop: 'var(--spacing-lg)',
            textAlign: 'center',
          }}>
            <Link
              href="/shop/cart"
              style={{
                color: 'var(--color-accent)',
                textDecoration: 'none',
                fontWeight: 'var(--font-weight-bold)',
              }}
            >
              View Cart →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
