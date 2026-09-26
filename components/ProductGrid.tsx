'use client';

import Link from 'next/link';
import ProductImage from './ProductImage';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image_url: string;
  category_id: number;
}

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
}

export default function ProductGrid({ products, columns = 3 }: ProductGridProps) {
  const getStockStatus = (stock: number) => {
    if (stock === 0) return { text: 'Out of Stock', color: 'var(--color-error)' };
    if (stock < 5) return { text: 'Low Stock', color: 'var(--color-warning)' };
    return { text: 'In Stock', color: 'var(--color-success)' };
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fill, minmax(250px, 1fr))`,
      gap: 'var(--spacing-lg)',
    }}>
      {products.map((product) => {
        const status = getStockStatus(product.stock);
        return (
          <Link
            key={product.id}
            href={`/shop/${product.id}`}
            style={{
              backgroundColor: 'var(--color-white)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              textDecoration: 'none',
              transition: 'all var(--transition-normal)',
              display: 'flex',
              flexDirection: 'column',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Image */}
            <div style={{
              backgroundColor: 'var(--color-border)',
              aspectRatio: '1',
              overflow: 'hidden',
            }}>
              <ProductImage
                url={product.image_url}
                alt={product.name}
                size="thumbnail"
              />
            </div>

            {/* Content */}
            <div style={{
              padding: 'var(--spacing-md)',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}>
              {/* Product Info */}
              <div style={{ marginBottom: 'var(--spacing-md)' }}>
                <h3 style={{
                  margin: '0 0 var(--spacing-sm) 0',
                  fontSize: 'var(--font-size-base)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-primary)',
                  lineHeight: 'var(--line-height-tight)',
                  minHeight: '2.4em',
                }}>
                  {product.name}
                </h3>

                <p style={{
                  margin: '0',
                  fontSize: 'var(--font-size-xl)',
                  fontWeight: 'var(--font-weight-extra-bold)',
                  color: 'var(--color-accent)',
                }}>
                  ${product.price.toFixed(2)}
                </p>
              </div>

              {/* Stock Status */}
              <div style={{
                padding: 'var(--spacing-sm)',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--color-gray-light)',
                textAlign: 'center',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-bold)',
                color: status.color,
              }}>
                {status.text}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
