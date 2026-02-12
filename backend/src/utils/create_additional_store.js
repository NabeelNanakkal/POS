import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Store from '../models/Store.js';
import User from '../models/User.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

const createStore = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pos_system');
    console.log('Connected!');

    // Find the admin user
    const adminEmail = 'admin.alnoor@store.com';
    const admin = await User.findOne({ email: adminEmail });
    
    if (!admin) {
      console.error('Admin user not found:', adminEmail);
      process.exit(1);
    }

    console.log('Admin found:', admin.username, admin._id);

    // Find existing store to clone settings
    const existingStore = await Store.findOne({ owner: admin._id });
    
    const newStoreData = {
      name: 'Alnoor Store - Branch 2',
      code: 'ALNOOR002',
      address: '456 Second Ave, Branch District',
      phone: '1234567891',
      email: 'branch2@alnoor.com',
      status: 'Open',
      owner: admin._id,
      manager: admin._id,
      country: existingStore?.country,
      currency: existingStore?.currency,
      allowedPaymentModes: existingStore?.allowedPaymentModes
    };

    const existingNewStore = await Store.findOne({ code: newStoreData.code });
    if (existingNewStore) {
      console.log('Store ALNOOR002 already exists');
    } else {
      const newStore = await Store.create(newStoreData);
      console.log('New store created:', newStore.name, newStore.code);
    }

    console.log('Operation completed');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createStore();
