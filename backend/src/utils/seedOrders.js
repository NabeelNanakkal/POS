import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Order from '../models/Order.js';
import Store from '../models/Store.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

const seedOrders = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');

    const store = await Store.findOne({ code: 'IN-BLR-01' });
    if (!store) {
      console.error('Store not found!');
      process.exit(1);
    }

    const cashier = await User.findOne({ role: 'CASHIER' }) || await User.findOne({}) || { _id: new mongoose.Types.ObjectId('6747eec1c69baf3f3dc705') };
    
    // Fetch actual seeded products
    const products = await Product.find({});
    if (products.length === 0) {
      console.error('No products found! Please seed products first.');
      process.exit(1);
    }

    // Clear existing orders to avoid duplicates and ensure "real" data
    await Order.deleteMany({});
    console.log('Cleared existing orders.');

    const today = new Date();
    const orders = [];

    // Create 50+ orders over the last 30 days
    for (let i = 0; i < 30; i++) {
        const orderDate = new Date();
        orderDate.setDate(today.getDate() - i);
        
        // More orders on "today", "yesterday", and "last week"
        const density = i < 7 ? 4 : 2;
        const numOrders = Math.floor(Math.random() * density) + 1;

        for (let j = 0; j < numOrders; j++) {
            const numItems = Math.floor(Math.random() * 3) + 1;
            const items = [];
            let subtotal = 0;

            for (let k = 0; k < numItems; k++) {
                const prod = products[Math.floor(Math.random() * products.length)];
                const qty = Math.floor(Math.random() * 2) + 1;
                items.push({
                    product: prod._id,
                    name: prod.name,
                    sku: prod.sku,
                    quantity: qty,
                    price: prod.price,
                    subtotal: prod.price * qty
                });
                subtotal += prod.price * qty;
            }

            const tax = subtotal * 0.05;
            const total = subtotal + tax;

            const paymentMethods = ['CASH', 'CARD', 'UPI', 'WALLET'];
            const payments = [];
            
            // 30% chance of split payment
            if (Math.random() < 0.3) {
                const method1 = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
                let method2 = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
                while (method1 === method2) {
                    method2 = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
                }
                
                const amount1 = Math.round(total * 0.4);
                const amount2 = total - amount1;
                
                payments.push({ method: method1, amount: amount1 });
                payments.push({ method: method2, amount: amount2 });
            } else {
                const method = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
                payments.push({ method: method, amount: total });
            }

            orders.push({
                orderNumber: `ORD-${orderDate.getFullYear()}${(orderDate.getMonth()+1).toString().padStart(2, '0')}${orderDate.getDate().toString().padStart(2, '0')}-${i}${j}`,
                store: store._id,
                cashier: cashier._id,
                items: items,
                subtotal: subtotal,
                tax: tax,
                total: total,
                payments: payments,
                status: 'COMPLETED',
                createdAt: orderDate
            });
        }
    }

    await Order.insertMany(orders);
    console.log(`${orders.length} realistic orders seeded successfully!`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedOrders();
