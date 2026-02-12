import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

const findCashier = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const user = await User.findOne({ role: 'cashier' });
    if (user) {
        console.log(`Cashier found: ${user.name} ID: ${user._id}`);
    } else {
        const anyUser = await User.findOne({});
        if (anyUser) {
            console.log(`No cashier found, using: ${anyUser.name} ID: ${anyUser._id}`);
        } else {
            console.log('No users found.');
        }
    }
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

findCashier();
