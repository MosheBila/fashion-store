'use client';

import { useState } from 'react';

interface CategoryFormProps {
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
  isLoading?: boolean;
}

export default function CategoryForm({
  onSubmit,
  initialData,
  isLoading = false,
}: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
  });

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error submitting form';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: 'var(--color-white)',
        padding: 'var(--spacing-lg)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--color-border)',
      }}
    >
      <h2 style={{ marginBottom: 'var(--spacing-lg)', color: 'var(--color-primary)' }}>
        {initialData ? 'Edit Category' : 'Add New Category'}
      </h2>

      {/* Error Message */}
      {error && (
        <div
          style={{
            backgroundColor: '#ffebee',
            color: 'var(--color-error)',
            padding: 'var(--spacing-md)',
            borderRadius: 'var(--radius-sm)',
            marginBottom: 'var(--spacing-lg)',
          }}
        >
          {error}
        </div>
      )}

      {/* Category Name */}
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <label style={{
          display: 'block',
          marginBottom: 'var(--spacing-sm)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--color-primary)',
        }}>
          Category Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="e.g., Women's Clothing"
          style={{
            width: '100%',
            padding: 'var(--spacing-sm)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-family)',
            fontSize: 'var(--font-size-base)',
          }}
        />
        <p style={{
          fontSize: 'var(--font-size-sm)',
          color: 'var(--color-text-secondary)',
          marginTop: 'var(--spacing-sm)',
        }}>
          Min 2 characters, max 255
        </p>
      </div>

      {/* Description */}
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <label style={{
          display: 'block',
          marginBottom: 'var(--spacing-sm)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--color-primary)',
        }}>
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Optional: Describe this category"
          rows={3}
          style={{
            width: '100%',
            padding: 'var(--spacing-sm)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-family)',
            fontSize: 'var(--font-size-base)',
            resize: 'vertical',
          }}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting || isLoading}
        style={{
          width: '100%',
          padding: 'var(--spacing-md)',
          backgroundColor:
            submitting || isLoading ? 'var(--color-gray-medium)' : 'var(--color-primary)',
          color: 'var(--color-white)',
          border: 'none',
          borderRadius: 'var(--radius-sm)',
          fontWeight: 'var(--font-weight-bold)',
          fontSize: 'var(--font-size-base)',
          cursor: submitting || isLoading ? 'not-allowed' : 'pointer',
          opacity: submitting || isLoading ? 0.6 : 1,
          transition: 'all var(--transition-fast)',
        }}
      >
        {submitting || isLoading ? 'Please wait...' : initialData ? 'Update Category' : 'Create Category'}
      </button>
    </form>
  );
}
