import { sql } from '@vercel/postgres';

/**
 * Seed script to populate categories with women's fashion items
 */

const categories = [
  {
    name: 'New Arrivals',
    description: 'Latest collections just arrived',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=600&fit=crop',
  },
  {
    name: 'Dresses',
    description: 'Elegant dresses for every occasion',
    imageUrl: 'https://images.unsplash.com/photo-1612336307429-8a88e8d08dbb?w=600&h=600&fit=crop',
  },
  {
    name: 'Tops & Blouses',
    description: 'Stylish tops and blouses collection',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=600&fit=crop',
  },
  {
    name: 'Pants & Jeans',
    description: 'Premium pants and denim collection',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c62d465d1?w=600&h=600&fit=crop',
  },
  {
    name: 'Jackets & Outerwear',
    description: 'Luxurious jackets and coats',
    imageUrl: 'https://images.unsplash.com/photo-1520689214123-92ec07b5e5d6?w=600&h=600&fit=crop',
  },
  {
    name: 'Accessories',
    description: 'Complete your look with accessories',
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&h=600&fit=crop',
  },
  {
    name: 'Shoes',
    description: 'Designer shoes for every style',
    imageUrl: 'https://images.unsplash.com/photo-1543163521-9145f93210b5?w=600&h=600&fit=crop',
  },
  {
    name: 'Sale',
    description: 'Exclusive discounts on selected items',
    imageUrl: 'https://images.unsplash.com/photo-1513529260511-e37029e88e9e?w=600&h=600&fit=crop',
  },
];

async function seedCategories() {
  try {
    console.log('Starting category seeding...');

    // Clear existing categories (optional - comment out to keep existing)
    // await sql.query('DELETE FROM categories');

    for (const category of categories) {
      const result = await sql.query(
        `INSERT INTO categories (name, description, image_url)
         VALUES ($1, $2, $3)
         ON CONFLICT (name) DO UPDATE
         SET description = $2, image_url = $3
         RETURNING *`,
        [category.name, category.description, category.imageUrl]
      );

      console.log(`✓ Upserted category: ${result.rows[0].name}`);
    }

    console.log('\n✓ Category seeding completed!');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedCategories();
