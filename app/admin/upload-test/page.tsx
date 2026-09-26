'use client';

import { useState } from 'react';
import ImageUpload from '@/components/ImageUpload';
import ProductImage from '@/components/ProductImage';

/**
 * Test page for Cloudinary image upload and display
 * Shows ImageUpload component and renders uploaded image
 */
export default function UploadTestPage() {
  const [uploadedImage, setUploadedImage] = useState<{
    url: string;
    publicId: string;
  } | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleImageUpload = (url: string, publicId: string) => {
    setUploadedImage({ url, publicId });
    setSuccessMessage('Image uploaded successfully! ✓');
    setErrorMessage(null);

    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleError = (error: string) => {
    setErrorMessage(error);
    setSuccessMessage(null);
  };

  return (
    <div style={{
      backgroundColor: 'var(--color-background)',
      minHeight: '100vh',
      padding: 'var(--spacing-lg)',
    }}>
      <div style={{
        maxWidth: '1000px',
        margin: '0 auto',
      }}>
        {/* Header */}
        <h1 style={{
          color: 'var(--color-primary)',
          marginBottom: 'var(--spacing-lg)',
        }}>
          Image Upload Test
        </h1>

        <p style={{
          color: 'var(--color-text-secondary)',
          marginBottom: 'var(--spacing-lg)',
          fontSize: 'var(--font-size-base)',
        }}>
          Test the Cloudinary image upload integration. Upload an image and see it displayed with optimization.
        </p>

        {/* Success Message */}
        {successMessage && (
          <div style={{
            backgroundColor: '#e8f5e9',
            color: 'var(--color-success)',
            padding: 'var(--spacing-md)',
            borderRadius: 'var(--radius-sm)',
            marginBottom: 'var(--spacing-lg)',
          }}>
            {successMessage}
          </div>
        )}

        {/* Upload Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-2xl)',
        }}>
          {/* Upload Form */}
          <div>
            <ImageUpload
              onUpload={handleImageUpload}
              onError={handleError}
            />
          </div>

          {/* Display Uploaded Image */}
          {uploadedImage && (
            <div style={{
              backgroundColor: 'var(--color-white)',
              padding: 'var(--spacing-lg)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
            }}>
              <h3 style={{
                marginBottom: 'var(--spacing-md)',
                color: 'var(--color-primary)',
              }}>
                Uploaded Image
              </h3>

              <ProductImage
                url={uploadedImage.url}
                alt="Uploaded product"
                size="detail"
              />

              <div style={{
                marginTop: 'var(--spacing-lg)',
                backgroundColor: '#f5f5f5',
                padding: 'var(--spacing-md)',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-sm)',
                wordBreak: 'break-all',
                color: 'var(--color-text-secondary)',
              }}>
                <p style={{ marginBottom: 'var(--spacing-sm)', fontWeight: 'bold' }}>
                  Public ID:
                </p>
                <p>{uploadedImage.publicId}</p>

                <p style={{
                  marginBottom: 'var(--spacing-sm)',
                  fontWeight: 'bold',
                  marginTop: 'var(--spacing-md)',
                }}>
                  URL:
                </p>
                <p>{uploadedImage.url}</p>
              </div>
            </div>
          )}
        </div>

        {/* Image Sizes Demo */}
        {uploadedImage && (
          <div style={{
            backgroundColor: 'var(--color-white)',
            padding: 'var(--spacing-lg)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-border)',
          }}>
            <h2 style={{
              marginBottom: 'var(--spacing-lg)',
              color: 'var(--color-primary)',
            }}>
              Image Sizes & Optimization
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 'var(--spacing-lg)',
            }}>
              {/* Thumbnail */}
              <div>
                <h3 style={{
                  fontSize: 'var(--font-size-base)',
                  marginBottom: 'var(--spacing-md)',
                  color: 'var(--color-text-secondary)',
                }}>
                  Thumbnail (200×200)
                </h3>
                <ProductImage
                  url={uploadedImage.url}
                  alt="Thumbnail"
                  size="thumbnail"
                />
              </div>

              {/* Detail */}
              <div>
                <h3 style={{
                  fontSize: 'var(--font-size-base)',
                  marginBottom: 'var(--spacing-md)',
                  color: 'var(--color-text-secondary)',
                }}>
                  Detail (600×600)
                </h3>
                <ProductImage
                  url={uploadedImage.url}
                  alt="Detail"
                  size="detail"
                />
              </div>

              {/* Hero */}
              <div>
                <h3 style={{
                  fontSize: 'var(--font-size-base)',
                  marginBottom: 'var(--spacing-md)',
                  color: 'var(--color-text-secondary)',
                }}>
                  Hero (1200×800)
                </h3>
                <ProductImage
                  url={uploadedImage.url}
                  alt="Hero"
                  size="hero"
                />
              </div>
            </div>

            <div style={{
              marginTop: 'var(--spacing-lg)',
              padding: 'var(--spacing-md)',
              backgroundColor: '#f5f5f5',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-text-secondary)',
            }}>
              <p>
                <strong>Optimizations:</strong> All images use Cloudinary transformations for:
              </p>
              <ul style={{ marginLeft: 'var(--spacing-lg)', marginTop: 'var(--spacing-sm)' }}>
                <li>Automatic quality optimization (q_auto)</li>
                <li>Automatic format selection (f_auto: WebP for modern browsers)</li>
                <li>Responsive sizing based on use case</li>
                <li>Lazy loading for performance</li>
              </ul>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div style={{
          marginTop: 'var(--spacing-2xl)',
          padding: 'var(--spacing-lg)',
          backgroundColor: '#e3f2fd',
          borderRadius: 'var(--radius-sm)',
          borderLeft: '4px solid var(--color-info)',
          color: 'var(--color-primary)',
        }}>
          <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>📝 Instructions</h3>
          <ol style={{ marginLeft: 'var(--spacing-lg)' }}>
            <li>Make sure `.env.local` has valid Cloudinary credentials</li>
            <li>Select an image file (JPG, PNG, WebP, GIF)</li>
            <li>Click "Upload Image" to send to Cloudinary</li>
            <li>See the image displayed in different sizes with optimizations</li>
            <li>Copy the public ID to use in your products</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
