import { getCategories } from '@/lib/db';
import CategoryGrid from '@/app/components/CategoryGrid';

export const metadata = {
  title: 'Women\'s Fashion | Fashion Store',
  description: 'Explore our exclusive collection of women\'s fashion',
};

export default async function WomenPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">Women's Collection</h1>
          <p className="text-xl text-gray-300">
            Discover our curated selection of luxurious fashion for every occasion
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <CategoryGrid categories={categories} />
    </div>
  );
}
