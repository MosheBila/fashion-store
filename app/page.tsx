import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ backgroundColor: 'var(--color-background)' }}>
      {/* Navbar */}
      <nav style={{
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-white)',
        padding: 'var(--spacing-md) var(--spacing-lg)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-extra-bold)' }}>
          LUXURY FASHION
        </h1>
        <div style={{ display: 'flex', gap: 'var(--spacing-lg)' }}>
          <Link href="/shop" style={{ color: 'var(--color-white)', textDecoration: 'none' }}>
            Shop
          </Link>
          <Link href="/admin" style={{ color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 'bold' }}>
            Admin
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-white)',
        padding: 'var(--spacing-2xl)',
        textAlign: 'center',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <h2 style={{
          fontSize: 'var(--font-size-3xl)',
          fontWeight: 'var(--font-weight-extra-bold)',
          marginBottom: 'var(--spacing-lg)',
          maxWidth: '600px',
        }}>
          Curated Fashion for the Discerning
        </h2>
        <p style={{
          fontSize: 'var(--font-size-lg)',
          color: 'var(--color-text-light)',
          marginBottom: 'var(--spacing-lg)',
          maxWidth: '500px',
        }}>
          Premium clothing and accessories sourced from the finest designers worldwide.
        </p>
        <style>{`
          .hero-btn {
            background-color: var(--color-accent);
            color: var(--color-primary);
            padding: var(--spacing-md) var(--spacing-lg);
            border-radius: var(--radius-sm);
            text-decoration: none;
            font-weight: var(--font-weight-bold);
            font-size: var(--font-size-lg);
            display: inline-block;
            transition: all var(--transition-normal);
          }
          .hero-btn:hover {
            background-color: var(--color-primary);
            color: var(--color-accent);
          }
        `}</style>
        <Link href="/shop" className="hero-btn">
          Explore Collection
        </Link>
      </section>

      {/* Features Section */}
      <section style={{
        padding: 'var(--spacing-2xl) var(--spacing-lg)',
        backgroundColor: 'var(--color-white)',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'var(--spacing-lg)',
        }}>
          {[
            { icon: '📦', title: 'Free Shipping', desc: 'On orders over $100' },
            { icon: '🔒', title: 'Secure Checkout', desc: 'Stripe payment processing' },
            { icon: '💳', title: 'Easy Returns', desc: '30-day money-back guarantee' },
            { icon: '⭐', title: 'Premium Quality', desc: 'Curated selections only' },
          ].map((feature, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--color-gray-light)',
                padding: 'var(--spacing-lg)',
                borderRadius: 'var(--radius-sm)',
                textAlign: 'center',
                border: '1px solid var(--color-border)',
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-md)' }}>
                {feature.icon}
              </div>
              <h3 style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-sm)' }}>
                {feature.title}
              </h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        backgroundColor: 'var(--color-accent)',
        padding: 'var(--spacing-2xl)',
        textAlign: 'center',
        color: 'var(--color-primary)',
      }}>
        <h3 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--spacing-md)' }}>
          Ready to Discover?
        </h3>
        <p style={{ marginBottom: 'var(--spacing-lg)', fontSize: 'var(--font-size-lg)' }}>
          Browse our latest collection now
        </p>
        <Link
          href="/shop"
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
          Shop Now
        </Link>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-text-light)',
        padding: 'var(--spacing-lg)',
        textAlign: 'center',
        fontSize: 'var(--font-size-sm)',
      }}>
        <p>&copy; 2026 Luxury Fashion Store. All rights reserved.</p>
      </footer>
    </div>
  );
}
