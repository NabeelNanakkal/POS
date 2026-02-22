import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Store from './src/models/Store.js';
import { connectDB } from './src/config/database.js';

dotenv.config();

const seedNabeelBrand = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB...');

    // 1. Create Admin User "Nabeel"
    const adminData = {
      username: 'Nabeel',
      email: 'nabeel@shoabrand.com', // Constructed email
      password: '123456', // Numbers only as requested
      role: 'SUPER_ADMIN',
      isActive: true
    };

    let admin = await User.findOne({ email: adminData.email });
    if (!admin) {
      admin = await User.create(adminData);
      console.log('✅ Admin "Nabeel" created.');
      console.log(`   Email: ${adminData.email}`);
      console.log(`   Password: ${adminData.password}`);
    } else {
      console.log('ℹ️  Admin "Nabeel" already exists.');
      // Update password just in case
      admin.password = adminData.password;
      await admin.save();
      console.log('   Password updated.');
    }

    // 2. Create Stores (India and Saudi Arabia)
    const stores = [
      {
        name: 'Shoe Brand - Mumbai Flagship',
        code: 'IN-MUM-01',
        address: 'Phoenix Market City, Mumbai, India',
        phone: '+91 9876543210',
        email: 'mumbai@shoabrand.com',
        status: 'Open',
        isActive: true,
        manager: admin._id,
        currency: { code: 'INR', symbol: '₹', name: 'Indian Rupee' }
      },
      {
        name: 'Shoe Brand - Riyadh Mall',
        code: 'SA-RIY-01',
        address: 'Riyadh Park Mall, Riyadh, Saudi Arabia',
        phone: '+966 50 123 4567',
        email: 'riyadh@shoabrand.com',
        status: 'Open',
        isActive: true,
        manager: admin._id,
        currency: { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' }
      },
      {
          name: 'Shoe Brand - Jeddah Branch',
          code: 'SA-JED-01',
          address: 'Red Sea Mall, Jeddah, Saudi Arabia',
          phone: '+966 54 987 6543',
          email: 'jeddah@shoabrand.com',
          status: 'Open',
          isActive: true,
          manager: admin._id,
          currency: { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' }
      },
      {
          name: 'Shoe Brand - Bangalore Outlet',
          code: 'IN-BLR-01',
          address: 'Brigade Road, Bangalore, India',
          phone: '+91 80 1234 5678',
          email: 'bangalore@shoabrand.com',
          status: 'Open',
          isActive: true,
          manager: admin._id,
          currency: { code: 'INR', symbol: '₹', name: 'Indian Rupee' }
      }
    ];

    console.log('Creating Stores...');
    for (const storeData of stores) {
      const existing = await Store.findOne({ code: storeData.code });
      if (!existing) {
        await Store.create(storeData);
        console.log(`✅ Store "${storeData.name}" created.`);
      } else {
        console.log(`ℹ️  Store "${storeData.name}" already exists.`);
      }
    }

    console.log('🎉 Setup for Nabeel Shoe Brand completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedNabeelBrand();
