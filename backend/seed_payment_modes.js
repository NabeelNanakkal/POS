import mongoose from 'mongoose';
import dotenv from 'dotenv';
import PaymentMode from './src/models/PaymentMode.js';
import { connectDB } from './src/config/database.js';

dotenv.config();

const paymentModes = [
  { name: 'Cash', value: 'cash', icon: '💵' },
  { name: 'Card', value: 'card', icon: '💳' },
  { name: 'Digital', value: 'digital', icon: '📱' }
];

const seedPaymentModes = async () => {
  try {
    await connectDB();
    
    console.log('Seeding Payment Modes...');
    
    for (const mode of paymentModes) {
      await PaymentMode.findOneAndUpdate(
        { value: mode.value },
        mode,
        { upsert: true, new: true }
      );
    }
    
    console.log('Payment Modes seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding payment modes:', error);
    process.exit(1);
  }
};

seedPaymentModes();
