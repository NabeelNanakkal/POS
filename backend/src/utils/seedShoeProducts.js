import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Store from '../models/Store.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

const seedProducts = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');

    const store = await Store.findOne({ code: 'IN-BLR-01' });
    if (!store) {
      console.error('Store not found!');
      process.exit(1);
    }

    const categories = await Category.find({});
    const catMap = {};
    categories.forEach(c => catMap[c.name] = c._id);

    const products = [
      {
        name: 'Nike Air Max 270',
        sku: 'NIKE-AM270-001',
        barcode: '191887234567',
        description: 'Comfortable athletic sneakers',
        category: catMap['Sneakers'],
        price: 150.00,
        cost: 90.00,
        stock: 50,
        warehouseName: store.name,
        store: store._id
      },
      {
        name: 'Adidas Ultraboost',
        sku: 'ADI-UB-001',
        barcode: '191887234568',
        description: 'Elite running shoes',
        category: catMap['Sports Shoes'],
        price: 180.00,
        cost: 110.00,
        stock: 40,
        warehouseName: store.name,
        store: store._id
      },
      {
        name: 'Oxford Leather Shoes',
        sku: 'OXF-LTH-001',
        barcode: '191887234569',
        description: 'Classic formal leather shoes',
        category: catMap['Formal Shoes'],
        price: 120.00,
        cost: 70.00,
        stock: 30,
        warehouseName: store.name,
        store: store._id
      },
      {
        name: 'Loafers Brown',
        sku: 'LOF-BRN-001',
        barcode: '191887234570',
        description: 'Casual brown leather loafers',
        category: catMap['Casual Shoes'],
        price: 90.00,
        cost: 50.00,
        stock: 45,
        warehouseName: store.name,
        store: store._id
      },
      {
        name: 'Leather Boots',
        sku: 'LTH-BT-001',
        barcode: '191887234571',
        description: 'Durable brown leather boots',
        category: catMap['Boots'],
        price: 200.00,
        cost: 130.00,
        stock: 20,
        warehouseName: store.name,
        store: store._id
      }
    ];

    for (const prod of products) {
      const existing = await Product.findOne({ sku: prod.sku });
      if (!existing) {
        await Product.create(prod);
        console.log(`Product created: ${prod.name}`);
      } else {
        console.log(`Product already exists: ${prod.name}`);
      }
    }

    console.log('Shoe products seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedProducts();
