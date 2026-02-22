import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/user.model.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

const listUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pos_system');
    const users = await User.find({}, 'username email role');
    console.log('USERS_DATA:' + JSON.stringify(users, null, 2));
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

listUsers();
