'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductImage from '@/components/ProductImage';
import {
  getCart,
  updateQuantity,
  removeFromCart,
  clearCart,
  getCartTotal,
  CartItem,
} from '@/lib/cart';

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCart();
    // Subscribe to storage changes
    const handleStorageChange = () => loadCart();
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadCart = () => {
    const items = getCart();
    setCartItems(items);
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    updateQuantity(productId, quantity);
    loadCart();
  };

  const handleRemove = (productId: number) => {
    removeFromCart(productId);
    loadCart();
  };

  const handleClearCart = () => {
    if (confirm('Clear entire cart?')) {
      clearCart();
      loadCart();
    }
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('fashion-store-token');
      if (!token) {
        router.push('/auth/login?redirect=/shop/cart');
        return;
      }

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ items: cartItems }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Checkout failed');
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
      setCheckoutLoading(false);
    }
  };

  const { subtotal } = getCartTotal();
  const tax = subtotal * 0.1; // 10% tax
  const shipping = subtotal > 100 ? 0 : 15;
  const total = subtotal + tax + shipping;

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
          }}>
            <h1 style={{
              fontSize: 'var(--font-size-3xl)',
              fontWeight: 'var(--font-weight-extra-bold)',
              margin: '0',
            }}>
              Shopping Cart
            </h1>
            <Link
              href="/shop"
              style={{
                color: 'var(--color-accent)',
                textDecoration: 'none',
                fontWeight: 'var(--font-weight-bold)',
              }}
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 var(--spacing-lg)',
        display: 'grid',
        gridTemplateColumns: '1fr 350px',
        gap: 'var(--spacing-2xl)',
      }}>
        {/* Cart Items */}
        <div>
          {cartItems.length === 0 ? (
            <div style={{
              backgroundColor: 'var(--color-white)',
              padding: 'var(--spacing-2xl)',
              borderRadius: 'var(--radius-sm)',
              textAlign: 'center',
              color: 'var(--color-text-secondary)',
            }}>
              <p style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-md)' }}>
                Your cart is empty
              </p>
              <Link
                href="/shop"
                style={{
                  color: 'var(--color-accent)',
                  textDecoration: 'none',
                  fontWeight: 'var(--font-weight-bold)',
                }}
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <>
              <div style={{
                marginBottom: 'var(--spacing-lg)',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-text-secondary)',
              }}>
                {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in cart
              </div>

              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  style={{
                    backgroundColor: 'var(--color-white)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: 'var(--spacing-lg)',
                    marginBottom: 'var(--spacing-md)',
                    display: 'grid',
                    gridTemplateColumns: '120px 1fr 200px 100px',
                    gap: 'var(--spacing-lg)',
                    alignItems: 'center',
                  }}
                >
                  {/* Image */}
                  <div style={{
                    backgroundColor: 'var(--color-border)',
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden',
                  }}>
                    <ProductImage
                      url={item.imageUrl}
                      alt={item.name}
                      size="thumbnail"
                    />
                  </div>

                  {/* Details */}
                  <div>
                    <h3 style={{
                      margin: '0 0 var(--spacing-sm) 0',
                      color: 'var(--color-primary)',
                      fontWeight: 'var(--font-weight-bold)',
                    }}>
                      {item.name}
                    </h3>
                    <p style={{
                      margin: '0',
                      color: 'var(--color-accent)',
                      fontWeight: 'var(--font-weight-bold)',
                    }}>
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>

                  {/* Quantity */}
                  <div style={{
                    display: 'flex',
                    gap: 'var(--spacing-sm)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <button
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: 'var(--color-border)',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                      }}
                    >
                      −
                    </button>
                    <span style={{
                      width: '30px',
                      textAlign: 'center',
                      fontWeight: 'var(--font-weight-bold)',
                    }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: 'var(--color-border)',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                      }}
                    >
                      +
                    </button>
                  </div>

                  {/* Actions */}
                  <div style={{
                    textAlign: 'right',
                  }}>
                    <div style={{
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--color-primary)',
                      marginBottom: 'var(--spacing-md)',
                    }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <button
                      onClick={() => handleRemove(item.productId)}
                      style={{
                        backgroundColor: 'var(--color-error)',
                        color: 'var(--color-white)',
                        border: 'none',
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 'var(--font-weight-bold)',
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              {cartItems.length > 0 && (
                <button
                  onClick={handleClearCart}
                  style={{
                    backgroundColor: 'transparent',
                    color: 'var(--color-error)',
                    border: '1px solid var(--color-error)',
                    padding: 'var(--spacing-md)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontWeight: 'var(--font-weight-bold)',
                    marginTop: 'var(--spacing-lg)',
                  }}
                >
                  Clear Cart
                </button>
              )}
            </>
          )}
        </div>

        {/* Order Summary */}
        {cartItems.length > 0 && (
          <div style={{
            backgroundColor: 'var(--color-white)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            padding: 'var(--spacing-lg)',
            height: 'fit-content',
            position: 'sticky',
            top: 'var(--spacing-lg)',
          }}>
            <h2 style={{
              fontSize: 'var(--font-size-lg)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-primary)',
              margin: '0 0 var(--spacing-lg) 0',
            }}>
              Order Summary
            </h2>

            <div style={{
              borderBottom: '1px solid var(--color-border)',
              paddingBottom: 'var(--spacing-md)',
              marginBottom: 'var(--spacing-md)',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 'var(--spacing-sm)',
                fontSize: 'var(--font-size-sm)',
              }}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 'var(--spacing-sm)',
                fontSize: 'var(--font-size-sm)',
              }}>
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 'var(--font-size-sm)',
                color: 'var(--color-success)',
              }}>
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              {shipping === 0 && (
                <p style={{
                  fontSize: 'var(--font-size-xs)',
                  color: 'var(--color-success)',
                  margin: 'var(--spacing-sm) 0 0 0',
                }}>
                  ✓ Free shipping on orders over $100
                </p>
              )}
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 'var(--font-size-lg)',
              fontWeight: 'var(--font-weight-extra-bold)',
              color: 'var(--color-primary)',
              marginBottom: 'var(--spacing-lg)',
            }}>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

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

            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              style={{
                width: '100%',
                backgroundColor: checkoutLoading ? 'var(--color-gray-medium)' : 'var(--color-primary)',
                color: 'var(--color-white)',
                border: 'none',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 'var(--font-weight-bold)',
                cursor: checkoutLoading ? 'not-allowed' : 'pointer',
                marginBottom: 'var(--spacing-md)',
                opacity: checkoutLoading ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!checkoutLoading) {
                  e.currentTarget.style.backgroundColor = 'var(--color-accent)';
                  e.currentTarget.style.color = 'var(--color-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!checkoutLoading) {
                  e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                  e.currentTarget.style.color = 'var(--color-white)';
                }
              }}
            >
              {checkoutLoading ? 'Processing...' : 'Proceed to Checkout'}
            </button>

            <p style={{
              fontSize: 'var(--font-size-xs)',
              color: 'var(--color-text-secondary)',
              textAlign: 'center',
              margin: '0',
            }}>
              Secure payment powered by Stripe
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
