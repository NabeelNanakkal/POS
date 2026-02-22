import mongoose from 'mongoose';
import { config } from './src/config/constants.js';
import Category from './src/models/Category.js';
import Product from './src/models/Product.js';

const seedTestProducts = async () => {
  try {
    await mongoose.connect(config.mongodb.uri);
    console.log('Connected to MongoDB for seeding...');

    // 1. Get or Create a Category
    let category = await Category.findOne();
    if (!category) {
      category = await Category.create({
        name: 'General',
        description: 'Default category for testing'
      });
      console.log('Created default "General" category');
    }

    // 2. Clear existing test products (optional, but keep it clean)
    // await Product.deleteMany({ sku: { $regex: /^TEST-SKU/ } });

    // 3. Define 5 test products
    const testProducts = [
      {
        name: 'Smart Bluetooth Speaker',
        sku: 'TEST-SKU-001',
        barcode: '111222333444',
        description: 'Portable waterproof bluetooth speaker with deep bass',
        category: category._id,
        price: 59.99,
        retailPrice: 59.99,
        cost: 35.00,
        purchaseRate: 35.00,
        stock: 50,
        reorderPoint: 10,
        vendor: 'AudioTech Ltd',
        warehouseName: 'East Warehouse',
        isActive: true
      },
      {
        name: 'Ergonomic Office Chair',
        sku: 'TEST-SKU-002',
        barcode: '222333444555',
        description: 'High-back mesh chair with lumbar support',
        category: category._id,
        price: 189.99,
        retailPrice: 189.99,
        cost: 110.00,
        purchaseRate: 110.00,
        stock: 12,
        reorderPoint: 5,
        vendor: 'ComfortSolutions',
        warehouseName: 'Main Warehouse',
        isActive: true
      },
      {
        name: 'LED Desk Lamp',
        sku: 'TEST-SKU-003',
        barcode: '333444555666',
        description: 'Touch control lamp with 5 brightness levels',
        category: category._id,
        price: 29.50,
        retailPrice: 29.50,
        cost: 15.00,
        purchaseRate: 15.00,
        stock: 100,
        reorderPoint: 20,
        vendor: 'BrightLife',
        warehouseName: 'East Warehouse',
        isActive: true
      },
      {
        name: 'Wireless Gaming Mouse',
        sku: 'TEST-SKU-004',
        barcode: '444555666777',
        description: 'Ultra-lightweight gaming mouse with RGB',
        category: category._id,
        price: 75.00,
        retailPrice: 75.00,
        cost: 40.00,
        purchaseRate: 40.00,
        stock: 5,
        reorderPoint: 8, // This should trigger "Low Stock" status
        vendor: 'ProGamer Gear',
        warehouseName: 'Main Warehouse',
        isActive: true
      },
      {
        name: 'Laptop Cooling Pad',
        sku: 'TEST-SKU-005',
        barcode: '555666777888',
        description: 'Quiet dual fans with adjustable height',
        category: category._id,
        price: 24.99,
        retailPrice: 24.99,
        cost: 12.00,
        purchaseRate: 12.00,
        stock: 40,
        reorderPoint: 10,
        vendor: 'TechCool',
        warehouseName: 'East Warehouse',
        isActive: true
      }
    ];

    // 4. Insert Products
    const created = await Product.insertMany(testProducts);
    console.log(`Successfully added ${created.length} test products!`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedTestProducts();
