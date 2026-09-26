'use client';

import { useState, useEffect } from 'react';
import ProductForm from '@/components/ProductForm';

interface Product {
  id: number;
  name: string;
  category_id: number;
  price: number;
  stock: number;
  sizes: string;
  image_url: string;
}

interface Category {
  id: number;
  name: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load categories and products on mount
  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  const loadCategories = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/categories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const loadProducts = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/products', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (data: any) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create product');
      }

      const newProduct = await response.json();
      setProducts([newProduct, ...products]);
      setShowForm(false);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error creating product';
      setError(message);
      throw err;
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete product');
      }

      setProducts(products.filter((p) => p.id !== productId));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error deleting product';
      setError(message);
    }
  };

  const getCategoryName = (categoryId: number) => {
    return categories.find((c) => c.id === categoryId)?.name || 'Unknown';
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { color: 'var(--color-error)', text: 'Out of Stock' };
    if (stock < 10) return { color: 'var(--color-warning)', text: 'Low Stock' };
    return { color: 'var(--color-success)', text: 'In Stock' };
  };

  if (loading) {
    return <p style={{ color: 'var(--color-text-secondary)' }}>Loading products...</p>;
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--spacing-lg)',
      }}>
        <h1 style={{ color: 'var(--color-primary)' }}>Products Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            backgroundColor: showForm ? 'var(--color-error)' : 'var(--color-primary)',
            color: 'var(--color-white)',
            border: 'none',
            padding: 'var(--spacing-md) var(--spacing-lg)',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 'var(--font-weight-bold)',
            cursor: 'pointer',
          }}
        >
          {showForm ? '✕ Cancel' : '+ Add Product'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          backgroundColor: '#ffebee',
          color: 'var(--color-error)',
          padding: 'var(--spacing-md)',
          borderRadius: 'var(--radius-sm)',
          marginBottom: 'var(--spacing-lg)',
        }}>
          {error}
        </div>
      )}

      {/* Add Product Form */}
      {showForm && (
        <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <ProductForm
            categories={categories}
            onSubmit={handleCreateProduct}
          />
        </div>
      )}

      {/* Products Table */}
      <div style={{
        backgroundColor: 'var(--color-white)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
      }}>
        {products.length === 0 ? (
          <div style={{
            padding: 'var(--spacing-lg)',
            textAlign: 'center',
            color: 'var(--color-text-secondary)',
          }}>
            No products yet. Add your first product!
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-white)' }}>
                <th style={{
                  padding: 'var(--spacing-md)',
                  textAlign: 'left',
                  fontWeight: 'var(--font-weight-bold)',
                }}>
                  Product
                </th>
                <th style={{
                  padding: 'var(--spacing-md)',
                  textAlign: 'left',
                  fontWeight: 'var(--font-weight-bold)',
                }}>
                  Category
                </th>
                <th style={{
                  padding: 'var(--spacing-md)',
                  textAlign: 'center',
                  fontWeight: 'var(--font-weight-bold)',
                }}>
                  Price
                </th>
                <th style={{
                  padding: 'var(--spacing-md)',
                  textAlign: 'center',
                  fontWeight: 'var(--font-weight-bold)',
                }}>
                  Stock
                </th>
                <th style={{
                  padding: 'var(--spacing-md)',
                  textAlign: 'center',
                  fontWeight: 'var(--font-weight-bold)',
                }}>
                  Status
                </th>
                <th style={{
                  padding: 'var(--spacing-md)',
                  textAlign: 'center',
                  fontWeight: 'var(--font-weight-bold)',
                }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const status = getStockStatus(product.stock);
                return (
                  <tr
                    key={product.id}
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      transition: 'background-color var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-gray-light)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <td style={{
                      padding: 'var(--spacing-md)',
                      fontWeight: 'var(--font-weight-bold)',
                    }}>
                      {product.name}
                    </td>
                    <td style={{ padding: 'var(--spacing-md)' }}>
                      {getCategoryName(product.category_id)}
                    </td>
                    <td style={{
                      padding: 'var(--spacing-md)',
                      textAlign: 'center',
                      color: 'var(--color-accent)',
                      fontWeight: 'var(--font-weight-bold)',
                    }}>
                      ${product.price.toFixed(2)}
                    </td>
                    <td style={{ padding: 'var(--spacing-md)', textAlign: 'center' }}>
                      {product.stock}
                    </td>
                    <td style={{
                      padding: 'var(--spacing-md)',
                      textAlign: 'center',
                      color: status.color,
                      fontWeight: 'var(--font-weight-bold)',
                    }}>
                      {status.text}
                    </td>
                    <td style={{
                      padding: 'var(--spacing-md)',
                      textAlign: 'center',
                      display: 'flex',
                      gap: 'var(--spacing-sm)',
                      justifyContent: 'center',
                    }}>
                      <button
                        onClick={() => {
                          // Edit functionality placeholder
                          alert('Edit functionality coming soon!');
                        }}
                        style={{
                          backgroundColor: 'var(--color-info)',
                          color: 'var(--color-white)',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          fontSize: 'var(--font-size-sm)',
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        style={{
                          backgroundColor: 'var(--color-error)',
                          color: 'var(--color-white)',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: 'var(--radius-sm)',
                          cursor: 'pointer',
                          fontSize: 'var(--font-size-sm)',
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 'var(--spacing-lg)',
        marginTop: 'var(--spacing-2xl)',
      }}>
        <div style={{
          backgroundColor: 'var(--color-white)',
          padding: 'var(--spacing-lg)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--color-border)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'var(--font-weight-extra-bold)', color: 'var(--color-primary)' }}>
            {products.length}
          </div>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            Total Products
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--color-white)',
          padding: 'var(--spacing-lg)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--color-border)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'var(--font-weight-extra-bold)', color: 'var(--color-accent)' }}>
            ${products.reduce((sum, p) => sum + p.price * p.stock, 0).toFixed(0)}
          </div>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            Inventory Value
          </div>
        </div>

        <div style={{
          backgroundColor: 'var(--color-white)',
          padding: 'var(--spacing-lg)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--color-border)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'var(--font-weight-extra-bold)', color: 'var(--color-success)' }}>
            {products.reduce((sum, p) => sum + p.stock, 0)}
          </div>
          <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            Total Stock
          </div>
        </div>
      </div>
    </div>
  );
}
