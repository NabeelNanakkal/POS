import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Store from './src/models/Store.js';
import User from './src/models/User.js';

dotenv.config();

const seedStores = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Find a manager (admin)
    const admin = await User.findOne({ role: { $in: ['ADMIN', 'SUPER_ADMIN'] } });
    const managerId = admin ? admin._id : null;

    if (!managerId) {
        console.warn("No admin user found, stores will be created without a manager.");
    }

    const stores = [
      {
        name: 'Main Warehouse',
        code: 'WH-MAIN-001',
        address: '123 Main St, San Jose, CA',
        email: 'main.warehouse@pos.com',
        phone: '555-0101',
        isActive: true,
        manager: managerId
      },
      {
        name: 'East Warehouse',
        code: 'WH-EAST-002',
        address: '456 East Ave, New York, NY',
        email: 'east.warehouse@pos.com',
        phone: '555-0102',
        isActive: true,
        manager: managerId
      }
    ];

    for (const storeData of stores) {
      const existing = await Store.findOne({ name: storeData.name });
      if (existing) {
        console.log(`Store "${storeData.name}" already exists.`);
      } else {
        await Store.create(storeData);
        console.log(`Store "${storeData.name}" created.`);
      }
    }

    console.log('Seeding completed.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedStores();
