import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import Store from '../models/Store.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

const checkData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const stores = await Store.find({});
    console.log('Stores found:');
    stores.forEach(s => console.log(` - ${s.name} (${s.code}) ID: ${s._id}`));

    const products = await Product.find({});
    console.log(`\nTotal Products in DB: ${products.length}`);
    if (products.length > 0) {
        console.log('Sample Product Store ID:', products[0].store);
    }
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

checkData();
