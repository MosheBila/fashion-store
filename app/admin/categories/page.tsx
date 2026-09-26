'use client';

import { useState, useEffect } from 'react';
import CategoryForm from '@/components/CategoryForm';

interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load categories on mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/categories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (data: any) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create category');
      }

      const newCategory = await response.json();
      setCategories([newCategory, ...categories]);
      setShowForm(false);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error creating category';
      setError(message);
      throw err;
    }
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!confirm('Are you sure? This will only work if no products use this category.')) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete category');
      }

      setCategories(categories.filter((c) => c.id !== categoryId));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error deleting category';
      setError(message);
    }
  };

  if (loading) {
    return <p style={{ color: 'var(--color-text-secondary)' }}>Loading categories...</p>;
  }

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--spacing-lg)',
      }}>
        <h1 style={{ color: 'var(--color-primary)' }}>Categories Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            backgroundColor: showForm ? 'var(--color-error)' : 'var(--color-primary)',
            color: 'var(--color-white)',
            border: 'none',
            padding: 'var(--spacing-md) var(--spacing-lg)',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 'var(--font-weight-bold)',
            cursor: 'pointer',
          }}
        >
          {showForm ? '✕ Cancel' : '+ Add Category'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          backgroundColor: '#ffebee',
          color: 'var(--color-error)',
          padding: 'var(--spacing-md)',
          borderRadius: 'var(--radius-sm)',
          marginBottom: 'var(--spacing-lg)',
        }}>
          {error}
        </div>
      )}

      {/* Add Category Form */}
      {showForm && (
        <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <CategoryForm onSubmit={handleCreateCategory} />
        </div>
      )}

      {/* Categories Table */}
      <div style={{
        backgroundColor: 'var(--color-white)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
      }}>
        {categories.length === 0 ? (
          <div style={{
            padding: 'var(--spacing-lg)',
            textAlign: 'center',
            color: 'var(--color-text-secondary)',
          }}>
            No categories yet. Add your first category!
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
                  Category Name
                </th>
                <th style={{
                  padding: 'var(--spacing-md)',
                  textAlign: 'left',
                  fontWeight: 'var(--font-weight-bold)',
                }}>
                  Description
                </th>
                <th style={{
                  padding: 'var(--spacing-md)',
                  textAlign: 'center',
                  fontWeight: 'var(--font-weight-bold)',
                }}>
                  Created
                </th>
                <th style={{
                  padding: 'var(--spacing-md)',
                  textAlign: 'center',
                  fontWeight: 'var(--font-weight-bold)',
                }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr
                  key={category.id}
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
                  }}>
                    {category.name}
                  </td>
                  <td style={{
                    padding: 'var(--spacing-md)',
                    color: 'var(--color-text-secondary)',
                    maxWidth: '400px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {category.description || '—'}
                  </td>
                  <td style={{
                    padding: 'var(--spacing-md)',
                    textAlign: 'center',
                    fontSize: 'var(--font-size-sm)',
                    color: 'var(--color-text-secondary)',
                  }}>
                    {new Date(category.created_at).toLocaleDateString()}
                  </td>
                  <td style={{
                    padding: 'var(--spacing-md)',
                    textAlign: 'center',
                    display: 'flex',
                    gap: 'var(--spacing-sm)',
                    justifyContent: 'center',
                  }}>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      style={{
                        backgroundColor: 'var(--color-error)',
                        color: 'var(--color-white)',
                        border: 'none',
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        fontSize: 'var(--font-size-sm)',
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Stats */}
      <div style={{
        backgroundColor: 'var(--color-white)',
        padding: 'var(--spacing-lg)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--color-border)',
        marginTop: 'var(--spacing-lg)',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: 'var(--font-size-2xl)',
          fontWeight: 'var(--font-weight-extra-bold)',
          color: 'var(--color-primary)',
        }}>
          {categories.length}
        </div>
        <div style={{
          color: 'var(--color-text-secondary)',
          fontSize: 'var(--font-size-sm)',
        }}>
          Total Categories
        </div>
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
        <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>ℹ️ Note</h3>
        <p>
          Categories cannot be deleted if they have products assigned. Delete or reassign products
          to a different category first.
        </p>
      </div>
    </div>
  );
}
