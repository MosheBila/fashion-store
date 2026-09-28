'use client';

import Image from 'next/image';
import Link from 'next/link';

interface CategoryGridProps {
  categories: Array<{
    id: number;
    name: string;
    description: string | null;
    image_url: string | null;
  }>;
}

export default function CategoryGrid({ categories }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-8">
      {categories.map((category) => (
        <Link key={category.id} href={`/shop?category=${category.id}`}>
          <div className="group cursor-pointer h-80 relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 bg-gray-200">
            {/* Background Image */}
            {category.image_url ? (
              <Image
                src={category.image_url}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ) : (
              <div className="w-full h-full bg-gray-400 flex items-center justify-center">
                <span className="text-white">No Image</span>
              </div>
            )}

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6">
              <h2 className="text-2xl font-bold text-white mb-2">{category.name}</h2>
              <p className="text-white/90 text-sm line-clamp-2">
                {category.description || 'Discover our collection'}
              </p>
              <div className="mt-4 inline-block">
                <span className="text-white font-semibold group-hover:translate-x-2 transition-transform">
                  Shop Now →
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
