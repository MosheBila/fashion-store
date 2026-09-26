'use client';

import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div>
      <h1 style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-lg)' }}>
        Welcome to Admin Dashboard
      </h1>

      <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-2xl)' }}>
        Manage your fashion store products, categories, and inventory.
      </p>

      {/* Quick Actions Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 'var(--spacing-lg)',
        marginBottom: 'var(--spacing-2xl)',
      }}>
        {/* Products Card */}
        <Link
          href="/admin/products"
          style={{
            backgroundColor: 'var(--color-white)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            padding: 'var(--spacing-lg)',
            textDecoration: 'none',
            transition: 'all var(--transition-normal)',
            display: 'block',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}>👕</div>
          <h3 style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-sm)' }}>
            Products
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            Add, edit, and manage product inventory
          </p>
        </Link>

        {/* Categories Card */}
        <Link
          href="/admin/categories"
          style={{
            backgroundColor: 'var(--color-white)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            padding: 'var(--spacing-lg)',
            textDecoration: 'none',
            transition: 'all var(--transition-normal)',
            display: 'block',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}>🏷️</div>
          <h3 style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-sm)' }}>
            Categories
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            Organize products into categories
          </p>
        </Link>

        {/* Image Upload Card */}
        <Link
          href="/admin/upload-test"
          style={{
            backgroundColor: 'var(--color-white)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            padding: 'var(--spacing-lg)',
            textDecoration: 'none',
            transition: 'all var(--transition-normal)',
            display: 'block',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}>📸</div>
          <h3 style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-sm)' }}>
            Image Upload
          </h3>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            Test Cloudinary image uploads
          </p>
        </Link>
      </div>

      {/* Info Box */}
      <div style={{
        backgroundColor: '#e3f2fd',
        border: '1px solid var(--color-info)',
        borderRadius: 'var(--radius-sm)',
        padding: 'var(--spacing-lg)',
        color: 'var(--color-primary)',
      }}>
        <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>🔐 You're Authenticated</h3>
        <p style={{ lineHeight: 'var(--line-height-relaxed)' }}>
          Your JWT token is stored securely. All admin endpoints are protected with token verification.
          The middleware automatically checks your token on every request to admin routes.
        </p>
      </div>
    </div>
  );
}
