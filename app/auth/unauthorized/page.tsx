import Link from 'next/link';

export default function UnauthorizedPage() {
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
      <div style={{
        backgroundColor: 'var(--color-white)',
        padding: 'var(--spacing-2xl)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--color-border)',
        maxWidth: '500px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: 'var(--font-size-3xl)',
          color: 'var(--color-error)',
          marginBottom: 'var(--spacing-md)',
        }}>
          403
        </h1>

        <h2 style={{
          fontSize: 'var(--font-size-2xl)',
          color: 'var(--color-primary)',
          marginBottom: 'var(--spacing-md)',
        }}>
          Access Denied
        </h2>

        <p style={{
          color: 'var(--color-text-secondary)',
          marginBottom: 'var(--spacing-lg)',
          lineHeight: 'var(--line-height-relaxed)',
        }}>
          You don't have permission to access this area. Only administrators can access the admin panel.
        </p>

        <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center' }}>
          <Link
            href="/"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-white)',
              padding: 'var(--spacing-md) var(--spacing-lg)',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
              fontWeight: 'var(--font-weight-bold)',
              display: 'inline-block',
            }}
          >
            Back to Store
          </Link>

          <Link
            href="/auth/login"
            style={{
              backgroundColor: 'var(--color-border)',
              color: 'var(--color-primary)',
              padding: 'var(--spacing-md) var(--spacing-lg)',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
              fontWeight: 'var(--font-weight-bold)',
              display: 'inline-block',
              border: '1px solid var(--color-border)',
            }}
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
