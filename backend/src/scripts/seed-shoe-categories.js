import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/category.model.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Configure dotenv to read from backend root
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

const shoeCategories = [
  { name: 'Shoes', description: 'Main category for all types of footwear', parent: null },
  { name: 'Sneakers', description: 'Athletic and casual sneakers', parentName: 'Shoes' },
  { name: 'Formal Shoes', description: 'Professional and evening footwear', parentName: 'Shoes' },
  { name: 'Casual Shoes', description: 'Everyday comfortable footwear', parentName: 'Shoes' },
  { name: 'Sports Shoes', description: 'Specialized footwear for various sports', parentName: 'Shoes' },
  { name: 'Sandals', description: 'Open footwear for warm weather', parentName: 'Shoes' },
  { name: 'Boots', description: 'Footwear covering at least the ankle', parentName: 'Shoes' }
];

const seedShoes = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');

    for (const cat of shoeCategories) {
      let parentId = null;
      if (cat.parentName) {
        const parent = await Category.findOne({ name: cat.parentName });
        if (parent) {
          parentId = parent._id;
        }
      }

      const existingCat = await Category.findOne({ name: cat.name });
      if (!existingCat) {
        await Category.create({
          name: cat.name,
          description: cat.description,
          parent: parentId
        });
        console.log(`Category created: ${cat.name}`);
      } else {
        console.log(`Category already exists: ${cat.name}`);
        if (parentId && existingCat.parent?.toString() !== parentId.toString()) {
           existingCat.parent = parentId;
           await existingCat.save();
           console.log(`Updated parent for: ${cat.name}`);
        }
      }
    }

    console.log('Shoe categories seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedShoes();
