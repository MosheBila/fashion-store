'use client';

import Image from 'next/image';

interface ProductImageProps {
  url: string;
  alt: string;
  size?: 'thumbnail' | 'detail' | 'hero';
  priority?: boolean;
}

/**
 * Optimized product image component using Cloudinary transformations
 * Handles lazy loading, responsive sizes, and automatic format optimization
 */
export default function ProductImage({
  url,
  alt,
  size = 'detail',
  priority = false,
}: ProductImageProps) {
  if (!url) {
    return (
      <div
        style={{
          width: '100%',
          height: '300px',
          backgroundColor: 'var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 'var(--radius-sm)',
          color: 'var(--color-text-secondary)',
        }}
      >
        No image
      </div>
    );
  }

  // Get optimized URL based on size
  const getOptimizedUrl = (baseUrl: string, imageSize: string) => {
    // Cloudinary URL format: https://res.cloudinary.com/cloud-name/image/upload/TRANSFORMATIONS/public-id
    if (!baseUrl.includes('cloudinary.com')) {
      return baseUrl;
    }

    // Insert transformations after /upload/
    const transformations = {
      thumbnail: 'w_200,h_200,c_fill,q_auto,f_auto',
      detail: 'w_600,h_600,c_fit,q_auto,f_auto',
      hero: 'w_1200,h_800,c_fill,q_auto,f_auto',
    };

    const transformation = transformations[imageSize as keyof typeof transformations];
    return baseUrl.replace('/upload/', `/upload/${transformation}/`);
  };

  const optimizedUrl = getOptimizedUrl(url, size);

  // Image dimensions based on size
  const dimensions = {
    thumbnail: { width: 200, height: 200 },
    detail: { width: 600, height: 600 },
    hero: { width: 1200, height: 800 },
  };

  const { width, height } = dimensions[size as keyof typeof dimensions];

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        paddingBottom: `${(height / width) * 100}%`,
        backgroundColor: 'var(--color-border)',
        borderRadius: 'var(--radius-sm)',
        overflow: 'hidden',
      }}
    >
      <img
        src={optimizedUrl}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </div>
  );
}
