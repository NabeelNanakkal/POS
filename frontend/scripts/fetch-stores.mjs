import mongoose from 'mongoose';
import Store from './backend/src/models/Store.js';
import { config } from './backend/src/config/constants.js';

const fetchStores = async () => {
  try {
    await mongoose.connect(config.mongodb.uri);
    console.log('Connected to MongoDB');
    
    const stores = await Store.find().populate('owner');
    console.log('STORES_DATA:' + JSON.stringify(stores, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fetchStores();
