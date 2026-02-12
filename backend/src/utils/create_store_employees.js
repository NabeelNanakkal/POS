import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Store from '../models/Store.js';
import Employee from '../models/Employee.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

const createEmployees = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');

    const stores = await Store.find({ 
      code: { $in: ['IN-BLR-01', 'SA-JED-01', 'IN-MUM-01', 'SA-RIY-01'] } 
    });

    if (stores.length === 0) {
      console.error('No stores found! Please run seedData.js first.');
      process.exit(1);
    }

    console.log(`Found ${stores.length} stores to seed.`);

    const roles = [
      { role: 'MANAGER', pos: 'Store Manager', dept: 'Management', short: 'MGR' },
      { role: 'CASHIER', pos: 'Cashier', dept: 'Sales', short: 'CSH' },
      { role: 'ACCOUNTANT', pos: 'Accountant', dept: 'Finance', short: 'ACT' }
    ];

    for (const store of stores) {
      console.log(`\nSeeding employees for store: ${store.name} (${store.code})`);
      
      const storePrefix = store.code.toLowerCase().replace(/-/g, '_');
      
      for (const r of roles) {
        const email = `${r.role.toLowerCase()}@${store.code.toLowerCase()}.shoabrand.com`;
        const username = `${storePrefix}_${r.role.toLowerCase()}`;
        const employeeId = `EMP-${store.code}-${r.short}-001`;

        let user = await User.findOne({ email });
        
        if (user) {
          user.username = username;
          user.role = r.role;
          user.store = store._id;
          await user.save();
          console.log(`- Updated user: ${username}`);
        } else {
          user = await User.create({
            username,
            email,
            password: '123456', // Default password
            role: r.role,
            store: store._id
          });
          console.log(`- Created user: ${username}`);
        }

        let employee = await Employee.findOne({ user: user._id });
        if (employee) {
          employee.employeeId = employeeId;
          employee.position = r.pos;
          employee.department = r.dept;
          employee.store = store._id;
          await employee.save();
          console.log(`- Updated employee profile for: ${username}`);
        } else {
          await Employee.create({
            user: user._id,
            store: store._id,
            employeeId: employeeId,
            position: r.pos,
            department: r.dept,
            hireDate: new Date(),
            isActive: true
          });
          console.log(`- Created employee profile for: ${username}`);
        }
      }
    }

    console.log('\n--- Seeding Complete ---');
    process.exit(0);
  } catch (error) {
    console.error('Error creating employees:', error);
    process.exit(1);
  }
};

createEmployees();
