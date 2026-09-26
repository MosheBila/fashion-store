'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'var(--color-background)',
      }}>
        <p style={{ color: 'var(--color-text-secondary)' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: '250px',
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-white)',
        padding: 'var(--spacing-lg)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <h2 style={{
          marginBottom: 'var(--spacing-lg)',
          fontSize: 'var(--font-size-lg)',
          fontWeight: 'var(--font-weight-extra-bold)',
        }}>
          Admin Panel
        </h2>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
          {/* Main Section */}
          <div style={{
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-light)',
            paddingLeft: 'var(--spacing-md)',
            paddingTop: 'var(--spacing-md)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            MAIN
          </div>
          <Link
            href="/admin"
            style={{
              color: 'var(--color-white)',
              textDecoration: 'none',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              borderRadius: 'var(--radius-sm)',
              display: 'block',
              transition: 'background-color var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            📊 Dashboard
          </Link>

          {/* Catalog Section */}
          <div style={{
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-light)',
            paddingLeft: 'var(--spacing-md)',
            paddingTop: 'var(--spacing-lg)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            CATALOG
          </div>
          <Link
            href="/admin/products"
            style={{
              color: 'var(--color-white)',
              textDecoration: 'none',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              borderRadius: 'var(--radius-sm)',
              display: 'block',
              transition: 'background-color var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            👕 Products
          </Link>

          <Link
            href="/admin/categories"
            style={{
              color: 'var(--color-white)',
              textDecoration: 'none',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              borderRadius: 'var(--radius-sm)',
              display: 'block',
              transition: 'background-color var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            🏷️ Categories
          </Link>

          {/* Orders Section */}
          <div style={{
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-light)',
            paddingLeft: 'var(--spacing-md)',
            paddingTop: 'var(--spacing-lg)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            SALES
          </div>
          <Link
            href="/admin/orders"
            style={{
              color: 'var(--color-white)',
              textDecoration: 'none',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              borderRadius: 'var(--radius-sm)',
              display: 'block',
              transition: 'background-color var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            📦 Orders
          </Link>

          {/* Tools Section */}
          <div style={{
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-text-light)',
            paddingLeft: 'var(--spacing-md)',
            paddingTop: 'var(--spacing-lg)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            TOOLS
          </div>
          <Link
            href="/admin/upload-test"
            style={{
              color: 'var(--color-white)',
              textDecoration: 'none',
              padding: 'var(--spacing-sm) var(--spacing-md)',
              borderRadius: 'var(--radius-sm)',
              display: 'block',
              transition: 'background-color var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            📸 Image Upload Test
          </Link>
        </nav>

        {/* User Info & Logout */}
        {user && (
          <div style={{
            paddingTop: 'var(--spacing-lg)',
            borderTop: '1px solid rgba(212, 175, 55, 0.3)',
          }}>
            <div style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-md)', opacity: 0.8 }}>
              Logged in as:
            </div>
            <div style={{
              backgroundColor: 'rgba(212, 175, 55, 0.1)',
              padding: 'var(--spacing-sm)',
              borderRadius: 'var(--radius-sm)',
              marginBottom: 'var(--spacing-md)',
              fontSize: 'var(--font-size-sm)',
              wordBreak: 'break-word',
            }}>
              {user.email}
            </div>
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                backgroundColor: 'var(--color-accent)',
                color: 'var(--color-primary)',
                border: 'none',
                padding: 'var(--spacing-sm)',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 'var(--font-weight-bold)',
                cursor: 'pointer',
                transition: 'opacity var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.8';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              Logout
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        backgroundColor: 'var(--color-background)',
        padding: 'var(--spacing-lg)',
        overflowY: 'auto',
      }}>
        {children}
      </main>
    </div>
  );
}
