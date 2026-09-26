'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface LoginFormProps {
  mode?: 'login' | 'register';
  onSuccess?: (token: string) => void;
}

export default function LoginForm({ mode = 'login', onSuccess }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegister, setIsRegister] = useState(mode === 'register');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          ...(isRegister && { role: 'admin' }), // New admins default to admin role
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || `${isRegister ? 'Registration' : 'Login'} failed`);
      }

      const data = await response.json();

      // Save token to localStorage
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Call success callback
      onSuccess?.(data.token);

      // Redirect to admin panel
      router.push('/admin');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: 'var(--color-white)',
      padding: 'var(--spacing-lg)',
      borderRadius: 'var(--radius-sm)',
      border: '1px solid var(--color-border)',
      maxWidth: '400px',
      margin: '0 auto',
    }}>
      <h2 style={{
        marginBottom: 'var(--spacing-lg)',
        color: 'var(--color-primary)',
        textAlign: 'center',
      }}>
        {isRegister ? 'Create Admin Account' : 'Admin Login'}
      </h2>

      {/* Error Message */}
      {error && (
        <div style={{
          backgroundColor: '#ffebee',
          color: 'var(--color-error)',
          padding: 'var(--spacing-md)',
          borderRadius: 'var(--radius-sm)',
          marginBottom: 'var(--spacing-md)',
          fontSize: 'var(--font-size-sm)',
        }}>
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        {/* Email */}
        <div>
          <label style={{
            display: 'block',
            marginBottom: 'var(--spacing-sm)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-primary)',
          }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="admin@example.com"
            style={{
              width: '100%',
              padding: 'var(--spacing-sm)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--font-size-base)',
              fontFamily: 'var(--font-family)',
            }}
          />
        </div>

        {/* Password */}
        <div>
          <label style={{
            display: 'block',
            marginBottom: 'var(--spacing-sm)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-primary)',
          }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••"
            style={{
              width: '100%',
              padding: 'var(--spacing-sm)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--font-size-base)',
              fontFamily: 'var(--font-family)',
            }}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: 'var(--spacing-md)',
            backgroundColor: loading ? 'var(--color-gray-medium)' : 'var(--color-primary)',
            color: 'var(--color-white)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 'var(--font-weight-bold)',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            transition: 'all var(--transition-fast)',
          }}
        >
          {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Login'}
        </button>
      </form>

      {/* Toggle Mode */}
      <div style={{
        marginTop: 'var(--spacing-lg)',
        textAlign: 'center',
        fontSize: 'var(--font-size-sm)',
        color: 'var(--color-text-secondary)',
      }}>
        {isRegister ? 'Already have an account?' : "Don't have an account?"}
        <button
          type="button"
          onClick={() => setIsRegister(!isRegister)}
          style={{
            marginLeft: 'var(--spacing-sm)',
            background: 'none',
            border: 'none',
            color: 'var(--color-accent)',
            fontWeight: 'var(--font-weight-bold)',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          {isRegister ? 'Login' : 'Register'}
        </button>
      </div>

      {/* Info */}
      <div style={{
        marginTop: 'var(--spacing-lg)',
        padding: 'var(--spacing-md)',
        backgroundColor: '#e3f2fd',
        borderRadius: 'var(--radius-sm)',
        fontSize: 'var(--font-size-sm)',
        color: 'var(--color-primary)',
        lineHeight: 'var(--line-height-relaxed)',
      }}>
        <strong>Demo credentials:</strong>
        <div>Email: admin@example.com</div>
        <div>Password: password123</div>
      </div>
    </div>
  );
}
