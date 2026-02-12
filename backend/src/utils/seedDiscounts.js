import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Discount from '../models/Discount.js';
import Product from '../models/Product.js';
import Store from '../models/Store.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

const seedDiscounts = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');

    const store = await Store.findOne({ code: 'IN-BLR-01' });
    if (!store) {
      console.error('Store not found!');
      process.exit(1);
    }

    const airMax = await Product.findOne({ sku: 'NIKE-AM270-001' });
    const ultraboost = await Product.findOne({ sku: 'ADI-UB-001' });

    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1);

    const discounts = [
      {
        name: 'Welcome Offer',
        code: 'WELCOME10',
        description: '10% discount on all products',
        type: 'PERCENTAGE',
        value: 10,
        applicableTo: 'ALL_PRODUCTS',
        validFrom: today,
        validTo: nextMonth,
        isActive: true,
        store: store._id
      },
      {
        name: 'Sneaker Sale',
        code: 'NIKE20',
        description: '20% off on Nike Air Max 270',
        type: 'PERCENTAGE',
        value: 20,
        applicableTo: 'SPECIFIC_PRODUCTS',
        products: airMax ? [airMax._id] : [],
        validFrom: today,
        validTo: nextMonth,
        isActive: true,
        store: store._id
      },
      {
        name: 'Running Special',
        code: 'RUNFAST',
        description: 'Flat 30 off on Adidas Ultraboost',
        type: 'FIXED_AMOUNT',
        value: 30,
        applicableTo: 'SPECIFIC_PRODUCTS',
        products: ultraboost ? [ultraboost._id] : [],
        validFrom: today,
        validTo: nextMonth,
        isActive: true,
        store: store._id
      },
      {
        name: 'Weekend Deal',
        code: 'WEEKEND15',
        description: '15% off site-wide',
        type: 'PERCENTAGE',
        value: 15,
        applicableTo: 'ALL_PRODUCTS',
        validFrom: today,
        validTo: nextMonth,
        isActive: true,
        store: store._id
      }
    ];

    for (const d of discounts) {
      const existing = await Discount.findOne({ code: d.code });
      if (!existing) {
        await Discount.create(d);
        console.log(`Discount created: ${d.name}`);
      } else {
        console.log(`Discount already exists: ${d.name}`);
      }
    }

    console.log('Discounts seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDiscounts();
