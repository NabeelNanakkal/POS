import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Store from './src/models/Store.js';

dotenv.config();

const listStores = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    const stores = await Store.find({}, 'name code');
    console.log('--- STORES (Warehouses) ---');
    console.table(stores.map(s => ({ id: s._id, name: s.name, code: s.code })));
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

listStores();
