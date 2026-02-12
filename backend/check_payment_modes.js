import mongoose from 'mongoose';
import dotenv from 'dotenv';
import PaymentMode from './src/models/PaymentMode.js';
import { connectDB } from './src/config/database.js';

dotenv.config();

const checkPaymentModes = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB...');

    const modes = await PaymentMode.find({});
    console.log(`Found ${modes.length} payment modes.`);
    modes.forEach(m => console.log(`- ${m.name} (${m.value})`));

    process.exit(0);
  } catch (error) {
    console.error('Error checking data:', error);
    process.exit(1);
  }
};

checkPaymentModes();
