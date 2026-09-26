'use client';

import Link from 'next/link';

export default function OrderCancelPage() {
  return (
    <div style={{
      backgroundColor: 'var(--color-background)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--spacing-lg)',
    }}>
      <div style={{
        backgroundColor: 'var(--color-white)',
        borderRadius: 'var(--radius-sm)',
        padding: 'var(--spacing-2xl)',
        maxWidth: '500px',
        textAlign: 'center',
        border: '1px solid var(--color-border)',
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: 'var(--spacing-lg)',
          color: 'var(--color-warning)',
        }}>
          ✕
        </div>

        <h1 style={{
          fontSize: 'var(--font-size-3xl)',
          fontWeight: 'var(--font-weight-extra-bold)',
          color: 'var(--color-primary)',
          margin: '0 0 var(--spacing-md) 0',
        }}>
          Payment Cancelled
        </h1>

        <p style={{
          color: 'var(--color-text-secondary)',
          marginBottom: 'var(--spacing-md)',
          fontSize: 'var(--font-size-base)',
        }}>
          Your payment was cancelled. Your cart items have been saved, and you can try again whenever you're ready.
        </p>

        <div style={{
          backgroundColor: '#fff3cd',
          color: 'var(--color-warning)',
          padding: 'var(--spacing-md)',
          borderRadius: 'var(--radius-sm)',
          marginBottom: 'var(--spacing-2xl)',
          fontSize: 'var(--font-size-sm)',
        }}>
          <p style={{ margin: '0' }}>
            No charges have been made to your account.
          </p>
        </div>

        <div style={{
          display: 'flex',
          gap: 'var(--spacing-md)',
          justifyContent: 'center',
        }}>
          <Link
            href="/shop/cart"
            style={{
              flex: 1,
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-white)',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
              fontWeight: 'var(--font-weight-bold)',
              cursor: 'pointer',
              border: 'none',
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
            Return to Cart
          </Link>
          <Link
            href="/shop"
            style={{
              flex: 1,
              backgroundColor: 'var(--color-border)',
              color: 'var(--color-text-primary)',
              padding: 'var(--spacing-md)',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
              fontWeight: 'var(--font-weight-bold)',
              cursor: 'pointer',
              border: 'none',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-primary)';
              e.currentTarget.style.color = 'var(--color-white)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-border)';
              e.currentTarget.style.color = 'var(--color-text-primary)';
            }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
