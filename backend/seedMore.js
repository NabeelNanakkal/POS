import mongoose from 'mongoose';
import { config } from './src/config/constants.js';
import Category from './src/models/Category.js';
import Product from './src/models/Product.js';

const seedMoreProducts = async () => {
  try {
    await mongoose.connect(config.mongodb.uri);
    console.log('Connected to MongoDB for seeding...');

    let category = await Category.findOne();
    if (!category) {
      category = await Category.create({ name: 'General', description: 'Default category' });
    }

    const moreProducts = [
      {
        name: 'Mechanical Keyboard RGB',
        sku: 'TEST-SKU-006',
        barcode: '666777888999',
        description: 'Tactile mechanical switches with customizable lighting',
        category: category._id,
        price: 89.99,
        retailPrice: 89.99,
        cost: 45.00,
        purchaseRate: 45.00,
        stock: 25,
        reorderPoint: 10,
        vendor: 'KeyMaster',
        warehouseName: 'Main Warehouse',
        isActive: true
      },
      {
        name: 'Ultrawide Curved Monitor',
        sku: 'TEST-SKU-007',
        barcode: '777888999000',
        description: '34-inch 144Hz curved gaming monitor',
        category: category._id,
        price: 499.99,
        retailPrice: 499.99,
        cost: 320.00,
        purchaseRate: 320.00,
        stock: 8,
        reorderPoint: 5,
        vendor: 'VisionTech',
        warehouseName: 'Main Warehouse',
        isActive: true
      },
      {
        name: 'USB-C Docking Station',
        sku: 'TEST-SKU-008',
        barcode: '888999000111',
        description: '10-in-1 hub with dual HDMI and power delivery',
        category: category._id,
        price: 65.00,
        retailPrice: 65.00,
        cost: 30.00,
        purchaseRate: 30.00,
        stock: 30,
        reorderPoint: 10,
        vendor: 'ConnectIt',
        warehouseName: 'East Warehouse',
        isActive: true
      },
      {
        name: 'Noise Cancelling Headphones',
        sku: 'TEST-SKU-009',
        barcode: '999000111222',
        description: 'Over-ear wireless headphones with 40h battery',
        category: category._id,
        price: 249.00,
        retailPrice: 249.00,
        cost: 150.00,
        purchaseRate: 150.00,
        stock: 15,
        reorderPoint: 5,
        vendor: 'AudioTech Ltd',
        warehouseName: 'Main Warehouse',
        isActive: true
      },
      {
        name: 'Webcam 4K Ultra HD',
        sku: 'TEST-SKU-010',
        barcode: '000111222333',
        description: 'Wide angle webcam with auto-focus and dual mic',
        category: category._id,
        price: 120.00,
        retailPrice: 120.00,
        cost: 65.00,
        purchaseRate: 65.00,
        stock: 20,
        reorderPoint: 5,
        vendor: 'StreamGear',
        warehouseName: 'East Warehouse',
        isActive: true
      },
      {
        name: 'Laptop Stand Aluminum',
        sku: 'TEST-SKU-011',
        barcode: '111333555777',
        description: 'Adjustable height ventilated laptop riser',
        category: category._id,
        price: 35.00,
        retailPrice: 35.00,
        cost: 12.00,
        purchaseRate: 12.00,
        stock: 60,
        reorderPoint: 15,
        vendor: 'TechCool',
        warehouseName: 'East Warehouse',
        isActive: true
      },
      {
        name: 'External SSD 1TB',
        sku: 'TEST-SKU-012',
        barcode: '222444666888',
        description: 'High-speed portable solid state drive',
        category: category._id,
        price: 110.00,
        retailPrice: 110.00,
        cost: 70.00,
        purchaseRate: 70.00,
        stock: 45,
        reorderPoint: 10,
        vendor: 'DataSafe',
        warehouseName: 'Main Warehouse',
        isActive: true
      },
      {
        name: 'Smart Home Hub',
        sku: 'TEST-SKU-013',
        barcode: '333555777999',
        description: 'Central controller for all smart devices',
        category: category._id,
        price: 130.00,
        retailPrice: 130.00,
        cost: 80.00,
        purchaseRate: 80.00,
        stock: 10,
        reorderPoint: 5,
        vendor: 'HomeStyles',
        warehouseName: 'East Warehouse',
        isActive: true
      },
      {
        name: 'Graphics Tablet',
        sku: 'TEST-SKU-014',
        barcode: '444666888000',
        description: 'Drawing tablet with battery-free stylus',
        category: category._id,
        price: 199.00,
        retailPrice: 199.00,
        cost: 120.00,
        purchaseRate: 120.00,
        stock: 6,
        reorderPoint: 4,
        vendor: 'CreativeTools',
        warehouseName: 'Main Warehouse',
        isActive: true
      },
      {
        name: 'Wi-Fi 6 Router',
        sku: 'TEST-SKU-015',
        barcode: '555777999111',
        description: 'Next-gen dual band gigabit wireless router',
        category: category._id,
        price: 155.00,
        retailPrice: 155.00,
        cost: 95.00,
        purchaseRate: 95.00,
        stock: 18,
        reorderPoint: 6,
        vendor: 'NetGear',
        warehouseName: 'East Warehouse',
        isActive: true
      }
    ];

    const created = await Product.insertMany(moreProducts);
    console.log(`Successfully added ${created.length} more test products!`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedMoreProducts();
