'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Stats {
  totalProducts: number;
  totalCategories: number;
  totalOrders: number;
  inventoryValue: number;
  totalStock: number;
  completedOrders: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    inventoryValue: 0,
    totalStock: 0,
    completedOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('authToken');

      // Fetch products
      const productsRes = await fetch('/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const products = productsRes.ok ? await productsRes.json() : [];

      // Fetch categories
      const categoriesRes = await fetch('/api/categories');
      const categories = categoriesRes.ok ? await categoriesRes.json() : [];

      // Calculate stats
      const inventoryValue = products.reduce((sum: number, p: any) => sum + p.price * p.stock, 0);
      const totalStock = products.reduce((sum: number, p: any) => sum + p.stock, 0);

      setStats({
        totalProducts: products.length,
        totalCategories: categories.length,
        totalOrders: 0, // Would load from /api/orders (Phase 9)
        inventoryValue,
        totalStock,
        completedOrders: 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--spacing-2xl)' }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
        <h1 style={{
          color: 'var(--color-primary)',
          fontSize: 'var(--font-size-3xl)',
          marginBottom: 'var(--spacing-md)',
        }}>
          Admin Dashboard
        </h1>
        <p style={{
          color: 'var(--color-text-secondary)',
          fontSize: 'var(--font-size-lg)',
        }}>
          Welcome back! Here's an overview of your store.
        </p>
      </div>

      {/* Main Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 'var(--spacing-lg)',
        marginBottom: 'var(--spacing-2xl)',
      }}>
        {/* Total Products */}
        <div style={{
          backgroundColor: 'var(--color-white)',
          padding: 'var(--spacing-lg)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--spacing-md)',
            fontWeight: 'var(--font-weight-bold)',
          }}>
            👕 Total Products
          </div>
          <div style={{
            fontSize: 'var(--font-size-3xl)',
            fontWeight: 'var(--font-weight-extra-bold)',
            color: 'var(--color-primary)',
          }}>
            {stats.totalProducts}
          </div>
          <div style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
            marginTop: 'var(--spacing-md)',
          }}>
            <Link href="/admin/products" style={{
              color: 'var(--color-accent)',
              textDecoration: 'none',
              fontWeight: 'var(--font-weight-bold)',
            }}>
              Manage →
            </Link>
          </div>
        </div>

        {/* Total Categories */}
        <div style={{
          backgroundColor: 'var(--color-white)',
          padding: 'var(--spacing-lg)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--spacing-md)',
            fontWeight: 'var(--font-weight-bold)',
          }}>
            🏷️ Categories
          </div>
          <div style={{
            fontSize: 'var(--font-size-3xl)',
            fontWeight: 'var(--font-weight-extra-bold)',
            color: 'var(--color-accent)',
          }}>
            {stats.totalCategories}
          </div>
          <div style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
            marginTop: 'var(--spacing-md)',
          }}>
            <Link href="/admin/categories" style={{
              color: 'var(--color-accent)',
              textDecoration: 'none',
              fontWeight: 'var(--font-weight-bold)',
            }}>
              Manage →
            </Link>
          </div>
        </div>

        {/* Inventory Value */}
        <div style={{
          backgroundColor: 'var(--color-white)',
          padding: 'var(--spacing-lg)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--spacing-md)',
            fontWeight: 'var(--font-weight-bold)',
          }}>
            💰 Inventory Value
          </div>
          <div style={{
            fontSize: 'var(--font-size-3xl)',
            fontWeight: 'var(--font-weight-extra-bold)',
            color: 'var(--color-accent)',
          }}>
            ${stats.inventoryValue.toFixed(0)}
          </div>
          <div style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
            marginTop: 'var(--spacing-md)',
          }}>
            Total stock value
          </div>
        </div>

        {/* Total Stock */}
        <div style={{
          backgroundColor: 'var(--color-white)',
          padding: 'var(--spacing-lg)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--color-border)',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
            marginBottom: 'var(--spacing-md)',
            fontWeight: 'var(--font-weight-bold)',
          }}>
            📦 Total Stock
          </div>
          <div style={{
            fontSize: 'var(--font-size-3xl)',
            fontWeight: 'var(--font-weight-extra-bold)',
            color: 'var(--color-success)',
          }}>
            {stats.totalStock}
          </div>
          <div style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--color-text-secondary)',
            marginTop: 'var(--spacing-md)',
          }}>
            Units in inventory
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        backgroundColor: 'var(--color-white)',
        padding: 'var(--spacing-lg)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--color-border)',
        marginBottom: 'var(--spacing-2xl)',
      }}>
        <h2 style={{
          color: 'var(--color-primary)',
          marginBottom: 'var(--spacing-lg)',
          fontSize: 'var(--font-size-xl)',
        }}>
          Quick Actions
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--spacing-md)',
        }}>
          <Link
            href="/admin/products"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-white)',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
              textAlign: 'center',
              fontWeight: 'var(--font-weight-bold)',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-accent)';
              e.currentTarget.style.color = 'var(--color-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-primary)';
              e.currentTarget.style.color = 'var(--color-white)';
            }}
          >
            ➕ Add Product
          </Link>

          <Link
            href="/admin/categories"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-white)',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
              textAlign: 'center',
              fontWeight: 'var(--font-weight-bold)',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-accent)';
              e.currentTarget.style.color = 'var(--color-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-primary)';
              e.currentTarget.style.color = 'var(--color-white)';
            }}
          >
            ➕ Add Category
          </Link>

          <Link
            href="/admin/upload-test"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-white)',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
              textAlign: 'center',
              fontWeight: 'var(--font-weight-bold)',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-accent)';
              e.currentTarget.style.color = 'var(--color-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-primary)';
              e.currentTarget.style.color = 'var(--color-white)';
            }}
          >
            📸 Test Image Upload
          </Link>

          <Link
            href="/"
            style={{
              backgroundColor: 'var(--color-accent)',
              color: 'var(--color-primary)',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
              textAlign: 'center',
              fontWeight: 'var(--font-weight-bold)',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-primary)';
              e.currentTarget.style.color = 'var(--color-accent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-accent)';
              e.currentTarget.style.color = 'var(--color-primary)';
            }}
          >
            🌐 View Store
          </Link>
        </div>
      </div>

      {/* Info Section */}
      <div style={{
        backgroundColor: '#e3f2fd',
        border: '1px solid var(--color-info)',
        borderRadius: 'var(--radius-sm)',
        padding: 'var(--spacing-lg)',
        color: 'var(--color-primary)',
      }}>
        <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>📋 Getting Started</h3>
        <ul style={{ marginLeft: 'var(--spacing-lg)', lineHeight: 'var(--line-height-relaxed)' }}>
          <li>1. Create categories from the <strong>Categories</strong> page</li>
          <li>2. Add products with images from the <strong>Products</strong> page</li>
          <li>3. Test image uploads at the <strong>Upload Test</strong> page</li>
          <li>4. View your store at <strong>View Store</strong></li>
          <li>5. Configure Stripe and Postgres for full functionality</li>
        </ul>
      </div>
    </div>
  );
}
