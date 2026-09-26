'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductGrid from '@/components/ProductGrid';

interface Product {
  id: number;
  name: string;
  category_id: number;
  price: number;
  stock: number;
  image_url: string;
  sizes: string;
  description: string;
}

interface Category {
  id: number;
  name: string;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
      ]);

      if (productsRes.ok) {
        const data = await productsRes.json();
        setProducts(data);
      }

      if (categoriesRes.ok) {
        const data = await categoriesRes.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesCategory = !selectedCategory || product.category_id === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div style={{
      backgroundColor: 'var(--color-background)',
      minHeight: '100vh',
      paddingBottom: 'var(--spacing-2xl)',
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-white)',
        padding: 'var(--spacing-2xl) var(--spacing-lg)',
        marginBottom: 'var(--spacing-2xl)',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 'var(--spacing-lg)',
          }}>
            <h1 style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: 'var(--font-weight-extra-bold)',
              margin: '0',
            }}>
              Our Collection
            </h1>
            <Link
              href="/"
              style={{
                color: 'var(--color-accent)',
                textDecoration: 'none',
                fontWeight: 'var(--font-weight-bold)',
              }}
            >
              ← Back to Home
            </Link>
          </div>
          <p style={{
            fontSize: 'var(--font-size-base)',
            color: 'rgba(255, 255, 255, 0.8)',
            margin: '0',
          }}>
            Discover our luxury fashion collection
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 var(--spacing-lg)',
      }}>
        {/* Search & Filters */}
        <div style={{
          backgroundColor: 'var(--color-white)',
          padding: 'var(--spacing-lg)',
          borderRadius: 'var(--radius-sm)',
          marginBottom: 'var(--spacing-2xl)',
          border: '1px solid var(--color-border)',
        }}>
          {/* Search */}
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <label style={{
              display: 'block',
              marginBottom: 'var(--spacing-sm)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-primary)',
            }}>
              Search Products
            </label>
            <input
              type="text"
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: 'var(--spacing-md)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-base)',
                fontFamily: 'var(--font-family)',
              }}
            />
          </div>

          {/* Category Filter */}
          <div>
            <label style={{
              display: 'block',
              marginBottom: 'var(--spacing-sm)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-primary)',
            }}>
              Filter by Category
            </label>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--spacing-sm)',
            }}>
              <button
                onClick={() => setSelectedCategory(null)}
                style={{
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  backgroundColor: selectedCategory === null ? 'var(--color-primary)' : 'var(--color-border)',
                  color: selectedCategory === null ? 'var(--color-white)' : 'var(--color-text-primary)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  fontWeight: 'var(--font-weight-bold)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                All Products
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: 'var(--spacing-sm) var(--spacing-md)',
                    backgroundColor: selectedCategory === cat.id ? 'var(--color-primary)' : 'var(--color-border)',
                    color: selectedCategory === cat.id ? 'var(--color-white)' : 'var(--color-text-primary)',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontWeight: 'var(--font-weight-bold)',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products */}
        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: 'var(--spacing-2xl)',
            color: 'var(--color-text-secondary)',
          }}>
            Loading products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: 'var(--spacing-2xl)',
            color: 'var(--color-text-secondary)',
          }}>
            <p style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-md)' }}>
              No products found
            </p>
            <p>Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div style={{
              marginBottom: 'var(--spacing-lg)',
              color: 'var(--color-text-secondary)',
              fontSize: 'var(--font-size-sm)',
            }}>
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </div>
            <ProductGrid products={filteredProducts} />
          </>
        )}
      </div>
    </div>
  );
}
