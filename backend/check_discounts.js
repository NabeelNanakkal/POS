import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Discount from './src/models/Discount.js';

dotenv.config();

const checkDiscounts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const discounts = await Discount.find({});
    console.log('Total discounts found:', discounts.length);
    console.log('Discounts details:', JSON.stringify(discounts, null, 2));

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
};

checkDiscounts();
