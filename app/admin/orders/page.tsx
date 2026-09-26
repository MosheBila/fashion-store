'use client';

import { useState, useEffect } from 'react';

interface Order {
  id: number;
  user_id: number;
  stripe_session_id: string;
  status: 'pending' | 'completed' | 'cancelled';
  total_price: number;
  items: Array<{ product_id: number; quantity: number; price: number }>;
  created_at: string;
  updated_at: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem('authToken');
      // Orders API would be implemented in Phase 9
      // For now, show placeholder UI
      setOrders([]);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = filter === 'all'
    ? orders
    : orders.filter((o) => o.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return { color: 'var(--color-success)', bg: '#e8f5e9' };
      case 'pending':
        return { color: 'var(--color-warning)', bg: '#fff3e0' };
      case 'cancelled':
        return { color: 'var(--color-error)', bg: '#ffebee' };
      default:
        return { color: 'var(--color-text-secondary)', bg: '#f5f5f5' };
    }
  };

  return (
    <div>
      <h1 style={{ color: 'var(--color-primary)', marginBottom: 'var(--spacing-lg)' }}>
        Orders Management
      </h1>

      {/* Filters */}
      <div style={{
        display: 'flex',
        gap: 'var(--spacing-md)',
        marginBottom: 'var(--spacing-lg)',
        flexWrap: 'wrap',
      }}>
        {(['all', 'pending', 'completed', 'cancelled'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            style={{
              padding: 'var(--spacing-sm) var(--spacing-md)',
              backgroundColor: filter === status ? 'var(--color-primary)' : 'var(--color-border)',
              color: filter === status ? 'var(--color-white)' : 'var(--color-text-primary)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 'var(--font-weight-bold)',
              cursor: 'pointer',
              textTransform: 'capitalize',
              transition: 'all var(--transition-fast)',
            }}
          >
            {status === 'all' ? 'All Orders' : status}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div style={{
        backgroundColor: 'var(--color-white)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
      }}>
        {loading ? (
          <div style={{
            padding: 'var(--spacing-lg)',
            textAlign: 'center',
            color: 'var(--color-text-secondary)',
          }}>
            Loading orders...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div style={{
            padding: 'var(--spacing-2xl)',
            textAlign: 'center',
            color: 'var(--color-text-secondary)',
          }}>
            <p style={{ marginBottom: 'var(--spacing-md)' }}>
              {filter === 'all'
                ? 'No orders yet'
                : `No ${filter} orders`}
            </p>
            <p style={{ fontSize: 'var(--font-size-sm)' }}>
              Orders will appear here once customers start purchasing.
            </p>
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
                  Order ID
                </th>
                <th style={{
                  padding: 'var(--spacing-md)',
                  textAlign: 'center',
                  fontWeight: 'var(--font-weight-bold)',
                }}>
                  Items
                </th>
                <th style={{
                  padding: 'var(--spacing-md)',
                  textAlign: 'center',
                  fontWeight: 'var(--font-weight-bold)',
                }}>
                  Total
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
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const statusColors = getStatusColor(order.status);
                return (
                  <tr
                    key={order.id}
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
                      color: 'var(--color-accent)',
                    }}>
                      #{order.id}
                    </td>
                    <td style={{
                      padding: 'var(--spacing-md)',
                      textAlign: 'center',
                    }}>
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                    </td>
                    <td style={{
                      padding: 'var(--spacing-md)',
                      textAlign: 'center',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--color-accent)',
                    }}>
                      ${order.total_price.toFixed(2)}
                    </td>
                    <td style={{
                      padding: 'var(--spacing-md)',
                      textAlign: 'center',
                    }}>
                      <span style={{
                        backgroundColor: statusColors.bg,
                        color: statusColors.color,
                        padding: '4px 12px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 'var(--font-weight-bold)',
                        textTransform: 'capitalize',
                        display: 'inline-block',
                      }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{
                      padding: 'var(--spacing-md)',
                      textAlign: 'center',
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--color-text-secondary)',
                    }}>
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Info Box */}
      <div style={{
        backgroundColor: '#e3f2fd',
        border: '1px solid var(--color-info)',
        borderRadius: 'var(--radius-sm)',
        padding: 'var(--spacing-lg)',
        marginTop: 'var(--spacing-lg)',
        color: 'var(--color-primary)',
      }}>
        <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>📝 Orders Coming in Phase 9</h3>
        <p style={{ lineHeight: 'var(--line-height-relaxed)' }}>
          The orders page will fully display customer orders after Stripe checkout is implemented in Phase 9.
          For now, you can see the interface structure and filtering options that will power order management.
        </p>
      </div>
    </div>
  );
}
