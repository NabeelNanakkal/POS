import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Store from './src/models/Store.js';

dotenv.config();

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    const users = await User.find({ role: 'CASHIER' }).populate('store');
    
    if (users.length === 0) {
        console.log("No Cashier users found.");
    } else {
        console.log("--- CASHIERS ---");
        users.forEach(u => {
            console.log(`User: ${u.username}, Role: ${u.role}, Store: ${u.store ? u.store.name : 'NONE'}`);
        });
    }

    // List stores to help assignment if needed
    const stores = await Store.find({});
    console.log("\n--- STORES ---");
    stores.forEach(s => console.log(`${s.name} (ID: ${s._id})`));

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkUsers();
