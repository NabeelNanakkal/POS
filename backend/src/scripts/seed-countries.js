import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Country from '../models/country.model.js';
import { countriesData } from './countriesData.js';

dotenv.config();

const seedCountries = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing countries
    await Country.deleteMany({});
    console.log('Cleared existing countries');

    // Insert all countries
    await Country.insertMany(countriesData);
    console.log(`Successfully seeded ${countriesData.length} countries`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding countries:', error);
    process.exit(1);
  }
};

seedCountries();
