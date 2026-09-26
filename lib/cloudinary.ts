import { v2 as cloudinary } from 'cloudinary';

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.warn('Cloudinary credentials are not set in environment variables');
}

/**
 * Configure Cloudinary API
 */
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

export { cloudinary };

/**
 * Get optimized Cloudinary URL with transformations
 */
export function getOptimizedImageUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
  }
) {
  const transformations = [
    options?.width && `w_${options.width}`,
    options?.height && `h_${options.height}`,
    options?.crop && `c_${options.crop}`,
    options?.quality && `q_${options.quality}`,
  ].filter(Boolean);

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations.join(',')}/${publicId}`;
}

/**
 * Delete image from Cloudinary by public ID
 */
export async function deleteImage(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
}
