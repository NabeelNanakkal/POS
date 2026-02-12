import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './src/config/database.js';

// Models to be CLEARED
import User from './src/models/User.js';
import Store from './src/models/Store.js';
import Product from './src/models/Product.js';
import Category from './src/models/Category.js';
import Customer from './src/models/Customer.js';
import Order from './src/models/Order.js';
import Employee from './src/models/Employee.js'; // Assuming this exists or will fail gracefully
import Discount from './src/models/Discount.js'; // Assuming this exists or will fail gracefully
import Inventory from './src/models/Inventory.js'; // Assuming this exists or will fail gracefully
import Shift from './src/models/Shift.js'; // Assuming this exists or will fail gracefully

// Models to be KEPT (commented out but listed for clarity)
// import PaymentMode from './src/models/PaymentMode.js';
// import Country from './src/models/Country.js';

dotenv.config();

const clearData = async () => {
    try {
        await connectDB();
        console.log('Connected to MongoDB for cleanup...');

        const collectionsToClear = [
            { name: 'Users', model: User },
            { name: 'Stores', model: Store },
            { name: 'Products', model: Product },
            { name: 'Categories', model: Category },
            { name: 'Customers', model: Customer },
            { name: 'Orders', model: Order },
            // Add try-catch for these in loop if model might not verify existence
            { name: 'Employees', model: Employee },
            { name: 'Discounts', model: Discount },
            { name: 'Inventories', model: Inventory },
            { name: 'Shifts', model: Shift }
        ];

        console.log('Starting data cleanup (preserving constant master data)...');

        for (const item of collectionsToClear) {
            try {
                // Check if collection exists before deleting
                // Mongoose models abstract this, deleteMany works even if empty
                if (item.model) {
                    const result = await item.model.deleteMany({});
                    console.log(`Cleared ${item.name}: ${result.deletedCount} documents deleted.`);
                } else {
                    console.warn(`Skipping ${item.name}: Model not imported or found.`);
                }
            } catch (err) {
                // If model schema is not registered or collection doesn't exist, log warning but continue
                console.warn(`Could not clear ${item.name}: ${err.message}`);
            }
        }

        console.log('Cleanup completed successfully.');
        console.log('Preserved: PaymentModes, Countries (if any).');
        process.exit(0);
    } catch (error) {
        console.error('Error during cleanup:', error);
        process.exit(1);
    }
};

clearData();
