import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import { connectDB } from './src/config/database.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();
    
    console.log('Restoring Default Admin...');
    
    const adminData = {
      username: 'admin',
      email: 'admin@pos.com',
      password: 'password123',
      role: 'SUPER_ADMIN',
      isActive: true
    };

    // Check if exists (though transaction clear should have removed it)
    let admin = await User.findOne({ email: adminData.email });
    
    if (!admin) {
      admin = await User.create(adminData);
      console.log('Default Admin created successfully.');
      console.log('Email: admin@pos.com');
      console.log('Password: password123');
    } else {
      console.log('Admin user already exists.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
