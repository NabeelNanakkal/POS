import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Store from '../models/Store.js';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Configure dotenv to read from backend root
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');

    // 1. Create a dummy store
    const storeData = {
      name: 'Downtown Branch',
      code: 'DT01',
      address: '123 Main St, City Center',
      phone: '555-0123',
      email: 'store.dt@pos.com',
      status: 'Open'
    };

    // Check if store exists
    let store = await Store.findOne({ code: storeData.code });
    if (!store) {
      store = await Store.create(storeData);
      console.log('Store created:', store.name);
    } else {
      console.log('Store already exists:', store.name);
    }

    // 2. Create 3 different role employees
    const employees = [
      {
        username: 'manager_jane',
        email: 'jane.manager@test.com',
        password: 'password123',
        role: 'MANAGER',
        store: store._id,
        position: 'Store Manager'
      },
      {
        username: 'cashier_bob',
        email: 'bob.cashier@test.com',
        password: 'password123',
        role: 'CASHIER',
        store: store._id,
        position: 'Cashier'
      },
      {
        username: 'inventory_mike',
        email: 'mike.inventory@test.com',
        password: 'password123',
        role: 'INVENTORY_MANAGER',
        store: store._id,
        position: 'Stock Manager'
      }
    ];

    for (const emp of employees) {
      let user = await User.findOne({ email: emp.email });
      if (!user) {
        user = await User.create({
          username: emp.username,
          email: emp.email,
          password: emp.password,
          role: emp.role,
          store: emp.store
        });
        console.log(`User created: ${emp.username} (${emp.role})`);
      } else {
        console.log(`User already exists: ${emp.username}`);
      }

      // Create Employee Profile if missing
      const existingEmployee = await Employee.findOne({ user: user._id });
      if (!existingEmployee) {
        await Employee.create({
          user: user._id,
          employeeId: `EMP${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 100)}`,
          position: emp.position,
          department: 'Operations',
          hireDate: new Date(),
          salary: 45000,
          store: emp.store,
          isActive: true
        });
        console.log(`Employee profile created for: ${emp.username}`);
      } else {
        console.log(`Employee profile already exists for: ${emp.username}`);
      }
    }

    // 3. Create Categories
    const categories = ['Electronics', 'Clothing', 'Groceries'];
    const categoryMap = {};

    for (const catName of categories) {
      let cat = await Category.findOne({ name: catName });
      if (!cat) {
        cat = await Category.create({ 
          name: catName, 
          description: `All kinds of ${catName.toLowerCase()}` 
        });
        console.log(`Category created: ${catName}`);
      } else {
        console.log(`Category exists: ${catName}`);
      }
      categoryMap[catName] = cat._id;
    }

    // 4. Create 10 Products for Downtown Branch
    const products = [
      {
        name: 'Pro Laptop 15"',
        sku: 'LAP-001',
        barcode: '88000101',
        description: 'High performance laptop for professionals',
        category: categoryMap['Electronics'],
        price: 1299.99,
        cost: 900.00,
        stock: 15,
        warehouseName: storeData.name
      },
      {
        name: 'Smart Phone X',
        sku: 'PHN-002',
        barcode: '88000102',
        description: 'Latest smartphone with 5G',
        category: categoryMap['Electronics'],
        price: 999.99,
        cost: 700.00,
        stock: 25,
        warehouseName: storeData.name
      },
      {
        name: 'Wireless Headphones',
        sku: 'AUD-003',
        barcode: '88000103',
        description: 'Noise cancelling headphones',
        category: categoryMap['Electronics'],
        price: 199.99,
        cost: 120.00,
        stock: 50,
        warehouseName: storeData.name
      },
      {
        name: 'Cotton T-Shirt',
        sku: 'CLO-004',
        barcode: '88000104',
        description: '100% Cotton premium t-shirt',
        category: categoryMap['Clothing'],
        price: 29.99,
        cost: 10.00,
        stock: 100,
        warehouseName: storeData.name
      },
      {
        name: 'Denim Jeans',
        sku: 'CLO-005',
        barcode: '88000105',
        description: 'Classic fit blue jeans',
        category: categoryMap['Clothing'],
        price: 59.99,
        cost: 25.00,
        stock: 60,
        warehouseName: storeData.name
      },
      {
        name: 'Running Sneakers',
        sku: 'CLO-006',
        barcode: '88000106',
        description: 'Lightweight running shoes',
        category: categoryMap['Clothing'],
        price: 89.99,
        cost: 40.00,
        stock: 30,
        warehouseName: storeData.name
      },
      {
        name: 'Organic Milk',
        sku: 'GRO-007',
        barcode: '88000107',
        description: 'Fresh organic whole milk',
        category: categoryMap['Groceries'],
        price: 4.99,
        cost: 3.00,
        stock: 40,
        warehouseName: storeData.name
      },
      {
        name: 'Whole Wheat Bread',
        sku: 'GRO-008',
        barcode: '88000108',
        description: 'Freshly baked wheat bread',
        category: categoryMap['Groceries'],
        price: 3.49,
        cost: 1.50,
        stock: 20,
        warehouseName: storeData.name
      },
      {
        name: 'Large Eggs (Dozen)',
        sku: 'GRO-009',
        barcode: '88000109',
        description: 'Free range chicken eggs',
        category: categoryMap['Groceries'],
        price: 5.99,
        cost: 3.50,
        stock: 35,
        warehouseName: storeData.name
      },
      {
        name: 'Arabica Coffee Beans',
        sku: 'GRO-010',
        barcode: '88000110',
        description: 'Premium roasted coffee beans',
        category: categoryMap['Groceries'],
        price: 14.99,
        cost: 8.00,
        stock: 45,
        warehouseName: storeData.name
      }
    ];

    for (const prod of products) {
      let product = await Product.findOne({ sku: prod.sku });
      if (!product) {
        await Product.create(prod);
        console.log(`Product created: ${prod.name}`);
      } else {
        console.log(`Product exists: ${prod.name}`);
        // Optional: Update warehouse if needed, but for seeding we skip
      }
    }

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
