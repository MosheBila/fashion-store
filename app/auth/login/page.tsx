import Link from 'next/link';
import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <div style={{
      backgroundColor: 'var(--color-background)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 'var(--spacing-lg)',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--spacing-2xl)', textAlign: 'center' }}>
        <Link href="/" style={{
          color: 'var(--color-primary)',
          textDecoration: 'none',
          marginBottom: 'var(--spacing-lg)',
          display: 'block',
        }}>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-extra-bold)' }}>
            LUXURY FASHION
          </h1>
        </Link>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-base)' }}>
          Admin Access
        </p>
      </div>

      {/* Login Form */}
      <LoginForm mode="login" />

      {/* Footer Link */}
      <div style={{
        marginTop: 'var(--spacing-2xl)',
        textAlign: 'center',
        fontSize: 'var(--font-size-sm)',
        color: 'var(--color-text-secondary)',
      }}>
        <Link href="/" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>
          Back to store
        </Link>
      </div>
    </div>
  );
}
