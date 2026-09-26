'use client';

import { useState, useRef } from 'react';

interface ImageUploadProps {
  onUpload: (url: string, publicId: string) => void;
  onError?: (error: string) => void;
}

export default function ImageUpload({ onUpload, onError }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      const err = 'Please select an image file';
      setError(err);
      onError?.(err);
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      const err = 'Image must be smaller than 5MB';
      setError(err);
      onError?.(err);
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    setError(null);
  };

  const handleUpload = async () => {
    if (!fileInputRef.current?.files?.[0]) {
      const err = 'Please select an image first';
      setError(err);
      onError?.(err);
      return;
    }

    const file = fileInputRef.current.files[0];
    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setError(null);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      const data = await response.json();
      onUpload(data.url, data.publicId);

      // Reset form
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed';
      setError(message);
      onError?.(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-sm)',
      padding: 'var(--spacing-lg)',
      backgroundColor: 'var(--color-white)',
    }}>
      <h3 style={{ marginBottom: 'var(--spacing-md)', color: 'var(--color-primary)' }}>
        Upload Product Image
      </h3>

      {/* Preview */}
      {preview && (
        <div style={{
          marginBottom: 'var(--spacing-md)',
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
        }}>
          <img
            src={preview}
            alt="Preview"
            style={{
              maxWidth: '100%',
              maxHeight: '300px',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        </div>
      )}

      {/* File Input */}
      <div style={{ marginBottom: 'var(--spacing-md)' }}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{
            display: 'block',
            width: '100%',
            padding: 'var(--spacing-sm)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--color-white)',
            cursor: 'pointer',
          }}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          backgroundColor: '#ffebee',
          color: 'var(--color-error)',
          padding: 'var(--spacing-sm)',
          borderRadius: 'var(--radius-sm)',
          marginBottom: 'var(--spacing-md)',
          fontSize: 'var(--font-size-sm)',
        }}>
          {error}
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={uploading || !fileInputRef.current?.files?.length}
        style={{
          width: '100%',
          padding: 'var(--spacing-md)',
          backgroundColor: uploading ? 'var(--color-gray-medium)' : 'var(--color-primary)',
          color: 'var(--color-white)',
          border: 'none',
          borderRadius: 'var(--radius-sm)',
          fontWeight: 'var(--font-weight-bold)',
          cursor: uploading ? 'not-allowed' : 'pointer',
          opacity: uploading ? 0.6 : 1,
          transition: 'all var(--transition-fast)',
        }}
      >
        {uploading ? 'Uploading...' : 'Upload Image'}
      </button>

      {/* Helper Text */}
      <p style={{
        fontSize: 'var(--font-size-sm)',
        color: 'var(--color-text-secondary)',
        marginTop: 'var(--spacing-md)',
        margin: 'var(--spacing-md) 0 0 0',
      }}>
        Max 5MB. Supported formats: JPG, PNG, WebP, GIF
      </p>
    </div>
  );
}
