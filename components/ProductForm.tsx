'use client';

import { useState } from 'react';
import ImageUpload from './ImageUpload';

interface ProductFormProps {
  categories: Array<{ id: number; name: string }>;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
  isLoading?: boolean;
}

export default function ProductForm({
  categories,
  onSubmit,
  initialData,
  isLoading = false,
}: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    categoryId: initialData?.category_id || '',
    price: initialData?.price || '',
    stock: initialData?.stock || '',
    description: initialData?.description || '',
    sizes: initialData?.sizes || '',
    imageUrl: initialData?.image_url || '',
  });

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (url: string, publicId: string) => {
    setFormData((prev) => ({
      ...prev,
      imageUrl: url,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await onSubmit({
        ...formData,
        categoryId: parseInt(formData.categoryId),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      });
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
        {initialData ? 'Edit Product' : 'Add New Product'}
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

      {/* Product Name */}
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <label style={{
          display: 'block',
          marginBottom: 'var(--spacing-sm)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--color-primary)',
        }}>
          Product Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="e.g., Premium Cotton T-Shirt"
          style={{
            width: '100%',
            padding: 'var(--spacing-sm)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-family)',
          }}
        />
      </div>

      {/* Grid: Category, Price, Stock */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 'var(--spacing-md)',
        marginBottom: 'var(--spacing-lg)',
      }}>
        {/* Category */}
        <div>
          <label style={{
            display: 'block',
            marginBottom: 'var(--spacing-sm)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-primary)',
          }}>
            Category *
          </label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: 'var(--spacing-sm)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-family)',
            }}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <label style={{
            display: 'block',
            marginBottom: 'var(--spacing-sm)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-primary)',
          }}>
            Price ($) *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            step="0.01"
            min="0"
            placeholder="99.99"
            style={{
              width: '100%',
              padding: 'var(--spacing-sm)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-family)',
            }}
          />
        </div>

        {/* Stock */}
        <div>
          <label style={{
            display: 'block',
            marginBottom: 'var(--spacing-sm)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-primary)',
          }}>
            Stock Qty *
          </label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            min="0"
            placeholder="50"
            style={{
              width: '100%',
              padding: 'var(--spacing-sm)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-family)',
            }}
          />
        </div>
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
          placeholder="Product description..."
          rows={4}
          style={{
            width: '100%',
            padding: 'var(--spacing-sm)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-family)',
            resize: 'vertical',
          }}
        />
      </div>

      {/* Sizes */}
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <label style={{
          display: 'block',
          marginBottom: 'var(--spacing-sm)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--color-primary)',
        }}>
          Sizes (comma-separated)
        </label>
        <input
          type="text"
          name="sizes"
          value={formData.sizes}
          onChange={handleChange}
          placeholder="e.g., XS,S,M,L,XL"
          style={{
            width: '100%',
            padding: 'var(--spacing-sm)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-family)',
          }}
        />
      </div>

      {/* Image Upload */}
      <div style={{ marginBottom: 'var(--spacing-lg)' }}>
        <h3 style={{ marginBottom: 'var(--spacing-md)', color: 'var(--color-primary)' }}>
          Product Image
        </h3>
        {formData.imageUrl && (
          <div style={{
            marginBottom: 'var(--spacing-md)',
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
          }}>
            <img
              src={formData.imageUrl}
              alt="Product preview"
              style={{
                maxWidth: '100%',
                maxHeight: '300px',
                objectFit: 'contain',
              }}
            />
          </div>
        )}
        <ImageUpload
          onUpload={handleImageUpload}
          onError={(error) => setError(error)}
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
        }}
      >
        {submitting || isLoading ? 'Please wait...' : initialData ? 'Update Product' : 'Create Product'}
      </button>
    </form>
  );
}
