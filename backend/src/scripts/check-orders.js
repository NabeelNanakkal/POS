import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from '../models/order.model.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

const checkOrders = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const count = await Order.countDocuments();
    console.log(`Total Orders in DB: ${count}`);
    
    const completedCount = await Order.countDocuments({ status: 'COMPLETED' });
    console.log(`Completed Orders: ${completedCount}`);

    const latest = await Order.find({}).sort({ createdAt: -1 }).limit(1);
    if (latest.length > 0) {
        console.log(`Latest order date: ${latest[0].createdAt}`);
    } else {
        console.log('No orders found.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

checkOrders();
